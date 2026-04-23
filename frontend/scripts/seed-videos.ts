/**
 * Seeds initial IELTS video lessons into Strapi.
 * Run after restarting Strapi: npx tsx scripts/seed-videos.ts
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error("Missing STRAPI_API_TOKEN in environment");
  process.exit(1);
}

const videos = [
  {
    youtube_id: "YngqHl_BLOU",
    title: "IELTS Writing Task 2: How to Write an Introduction",
    description:
      "Learn the step-by-step method for writing a strong IELTS Writing Task 2 introduction. IELTS Liz explains how to paraphrase the question and state your position clearly.",
    channel_name: "IELTS Liz",
    difficulty: "intermediate",
    category: "writing",
    duration_minutes: 8,
    is_published: true,
  },
  {
    youtube_id: "Zbh4doGGxsI",
    title: "Advanced IELTS Writing Task 2 Lessons",
    description:
      "Advanced techniques for IELTS Writing Task 2, covering essay structure, vocabulary, and how to achieve a band 7+.",
    channel_name: "IELTS Liz",
    difficulty: "advanced",
    category: "writing",
    duration_minutes: 15,
    is_published: true,
  },
  {
    youtube_id: "OsRiw_eKkyQ",
    title: "Practice IELTS Speaking Test — Full Mock Interview",
    description:
      "Watch a full IELTS Speaking mock test with examiner feedback. Covers Part 1, Part 2 (cue card), and Part 3 discussion.",
    channel_name: "IELTS Liz",
    difficulty: "intermediate",
    category: "speaking",
    duration_minutes: 14,
    is_published: true,
  },
];

async function seed() {
  console.log(`Seeding ${videos.length} video lessons to ${STRAPI_URL}...`);

  for (const video of videos) {
    const res = await fetch(`${STRAPI_URL}/api/video-lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ data: video }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error(`Failed to create "${video.title}":`, json.error?.message);
    } else {
      console.log(`✓ Created: ${video.title}`);
    }
  }

  console.log("Done!");
}

seed().catch(console.error);
