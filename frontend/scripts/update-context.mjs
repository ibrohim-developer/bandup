/**
 * Update existing question groups with context (questionText) and tableData from cached source data.
 *
 * Usage: node scripts/update-context.mjs
 *
 * Requires Strapi to be running on localhost:1337
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_FILE = path.join(__dirname, 'cache', 'readings-data.json')

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '285233ea2f0c0de2e18ad9fe3cb335372c6d73e4c232eda058b7d5c45718fbc68ec47387be21676bba42f9f58cc1d03572229c5f877e9df83575fe93bfc1095b87bebc31438cf3c33ca7e423fd76929675a7769a2d28e56b8a4e81c72c5d33f1b408ae2bc9242075837f5569d7a9e853b99b41d4d53e729ad3e65593ed3e02d0'

async function strapiFind(collection, params = {}) {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'object') {
      // Handle nested params like filters
      const flatten = (obj, prefix) => {
        for (const [key, val] of Object.entries(obj)) {
          const newKey = prefix ? `${prefix}[${key}]` : key
          if (typeof val === 'object' && val !== null) flatten(val, newKey)
          else qs.append(newKey, String(val))
        }
      }
      flatten(v, k)
    } else {
      qs.append(k, String(v))
    }
  }
  const url = `${STRAPI_URL}/api/${collection}?${qs.toString()}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  })
  const json = await res.json()
  return json.data || []
}

async function strapiUpdate(collection, documentId, data) {
  const res = await fetch(`${STRAPI_URL}/api/${collection}/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  })
  const json = await res.json()
  if (json.error) throw new Error(`Update failed: ${json.error.message}`)
  return json.data
}

async function main() {
  const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))

  // Build a map: source_id -> { questionText, tableData }
  const sourceMap = {}
  for (const item of cached) {
    for (const pk of ['part1', 'part2', 'part3']) {
      const part = item.reading[pk]
      if (!part) continue
      for (const g of (part.questions || [])) {
        sourceMap[g.id] = {
          questionText: g.questionText || '',
          tableData: g.tableData || null,
          headingOptions: g.headingOptions || null,
        }
      }
    }
  }

  console.log(`Source map built: ${Object.keys(sourceMap).length} groups`)

  // Fetch all question groups from Strapi (paginated)
  let page = 1
  let allGroups = []
  while (true) {
    const groups = await strapiFind('question-groups', {
      'pagination[page]': page,
      'pagination[pageSize]': 100,
      'fields[0]': 'metadata',
    })
    if (groups.length === 0) break
    allGroups = allGroups.concat(groups)
    page++
  }

  console.log(`Found ${allGroups.length} question groups in Strapi`)

  let updated = 0
  let skipped = 0

  for (const group of allGroups) {
    const sourceId = group.metadata?.source_id
    if (!sourceId || !sourceMap[sourceId]) {
      skipped++
      continue
    }

    const src = sourceMap[sourceId]
    const updateData = {}

    // Only update if there's meaningful content
    if (src.questionText && src.questionText !== '----' && src.questionText !== '') {
      updateData.context = src.questionText
    }

    // Store tableData in metadata
    if (src.tableData || src.headingOptions) {
      updateData.metadata = {
        ...group.metadata,
        tableData: src.tableData,
        headingOptions: src.headingOptions,
      }
    }

    if (Object.keys(updateData).length === 0) {
      skipped++
      continue
    }

    await strapiUpdate('question-groups', group.documentId, updateData)
    updated++

    if (updated % 10 === 0) console.log(`  Updated ${updated} groups...`)
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`)
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
