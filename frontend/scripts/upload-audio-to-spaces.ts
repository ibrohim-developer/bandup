/**
 * Upload cached audio files to DigitalOcean Spaces and update Strapi DB.
 *
 * Usage: npx tsx scripts/upload-audio-to-spaces.ts
 *
 * Requires env vars in .env.local:
 *   DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_ENDPOINT,
 *   DO_SPACES_BUCKET, DO_SPACES_CDN_URL
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env.local") });

const SPACES_KEY = process.env.DO_SPACES_KEY!;
const SPACES_SECRET = process.env.DO_SPACES_SECRET!;
const SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT!;
const SPACES_BUCKET = process.env.DO_SPACES_BUCKET!;
const CDN_URL = process.env.DO_SPACES_CDN_URL!;
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN!;

const s3 = new S3Client({
  endpoint: SPACES_ENDPOINT,
  region: "fra1",
  credentials: {
    accessKeyId: SPACES_KEY,
    secretAccessKey: SPACES_SECRET,
  },
  forcePathStyle: false,
});

const CACHE_DIR = resolve(__dirname, "cache/audio");

/**
 * Match a DB audio_url like `/uploads/listening_1125_cambridge_20_test_1_65303d3d69.mp3`
 * to a cached file like `listening-1125-cambridge-20-test-1.mp3`.
 *
 * Strategy: strip `/uploads/` prefix and hash suffix, replace underscores with dashes.
 */
function dbUrlToCacheFilename(dbUrl: string): string | null {
  // Extract filename: "listening_1125_cambridge_20_test_1_65303d3d69.mp3"
  const filename = dbUrl.replace("/uploads/", "");
  // Remove hash suffix (last _xxxxxxxxxxxx before .mp3)
  const withoutExt = filename.replace(".mp3", "");
  const parts = withoutExt.split("_");
  // Remove the last part (hash)
  parts.pop();
  // Join with dashes
  const cacheBase = parts.join("-") + ".mp3";
  return cacheBase;
}

async function uploadFile(filePath: string, key: string): Promise<string> {
  const body = readFileSync(filePath);
  await s3.send(
    new PutObjectCommand({
      Bucket: SPACES_BUCKET,
      Key: key,
      Body: body,
      ContentType: "audio/mpeg",
      ACL: "public-read",
    })
  );
  return `${CDN_URL}/${key}`;
}

async function updateStrapiAudioUrl(sectionId: number, newUrl: string): Promise<void> {
  // Use Strapi REST API to update via documentId
  // First get the documentId for this section
  const findRes = await fetch(
    `${STRAPI_URL}/api/listening-sections?filters[id][$eq]=${sectionId}&fields[0]=id`,
    {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    }
  );
  const findData = await findRes.json();
  const documentId = findData.data?.[0]?.documentId;
  if (!documentId) {
    console.error(`  No documentId found for section id=${sectionId}`);
    return;
  }

  const res = await fetch(`${STRAPI_URL}/api/listening-sections/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data: { audio_url: newUrl } }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`  Failed to update section ${sectionId}: ${err}`);
  }
}

async function main() {
  console.log("=== Upload Audio to DigitalOcean Spaces ===\n");

  // Read cached files
  const cachedFiles = readdirSync(CACHE_DIR).filter((f) => f.endsWith(".mp3"));
  console.log(`Found ${cachedFiles.length} cached audio files\n`);

  // Get all sections from Strapi
  const sectionsRes = await fetch(
    `${STRAPI_URL}/api/listening-sections?pagination[pageSize]=200&fields[0]=audio_url`,
    {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    }
  );
  const sectionsData = await sectionsRes.json();
  const sections: { id: number; documentId: string; audio_url: string }[] = sectionsData.data || [];
  console.log(`Found ${sections.length} listening sections in Strapi\n`);

  // Get unique audio URLs
  const uniqueUrls = [...new Set(sections.map((s) => s.audio_url))];
  console.log(`${uniqueUrls.length} unique audio URLs to process\n`);

  // Build cache lookup (lowercase for matching)
  const cacheMap = new Map<string, string>();
  for (const f of cachedFiles) {
    cacheMap.set(f.toLowerCase(), f);
  }

  const urlToNewUrl = new Map<string, string>();
  let uploaded = 0;
  let failed = 0;

  for (const dbUrl of uniqueUrls) {
    const expectedCache = dbUrlToCacheFilename(dbUrl);
    if (!expectedCache) {
      console.log(`  SKIP: Could not parse ${dbUrl}`);
      failed++;
      continue;
    }

    // Try exact match first, then try with trailing dash variations
    let cacheFile = cacheMap.get(expectedCache.toLowerCase());
    if (!cacheFile) {
      // Try with trailing dash (some files have it, e.g., "listening-1156-cambridge-19-test-1-.mp3")
      cacheFile = cacheMap.get(expectedCache.toLowerCase().replace(".mp3", "-.mp3"));
    }
    if (!cacheFile) {
      // Fuzzy match: find any cached file containing the same number ID
      const match = dbUrl.match(/listening[_-](\d+)/);
      if (match) {
        const id = match[1];
        cacheFile = cachedFiles.find((f) => f.includes(id));
      }
    }

    if (!cacheFile) {
      console.log(`  MISS: No cached file for ${dbUrl} (expected: ${expectedCache})`);
      failed++;
      continue;
    }

    const filePath = resolve(CACHE_DIR, cacheFile);
    const spacesKey = `audio/${cacheFile}`;

    try {
      console.log(`  Uploading ${cacheFile}...`);
      const cdnUrl = await uploadFile(filePath, spacesKey);
      urlToNewUrl.set(dbUrl, cdnUrl);
      uploaded++;
      console.log(`  OK: ${cdnUrl}`);
    } catch (err: any) {
      console.error(`  ERROR uploading ${cacheFile}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nUploaded: ${uploaded}, Failed: ${failed}\n`);

  // Update Strapi sections
  console.log("Updating Strapi audio URLs...\n");
  let updated = 0;
  for (const section of sections) {
    const newUrl = urlToNewUrl.get(section.audio_url);
    if (newUrl) {
      await updateStrapiAudioUrl(section.id, newUrl);
      updated++;
    }
  }

  console.log(`\nDone! Updated ${updated} sections.`);
}

main().catch(console.error);
