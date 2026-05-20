/**
 * Import readings from otaboyev-prep.uz API into Strapi.
 *
 * Usage: node scripts/import-readings.mjs
 *
 * Phase A: Fetch & cache all data from source API (safe to re-run — skips if cached)
 * Phase B: Import cached data into Strapi
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = path.join(__dirname, 'cache')
const CACHE_FILE = path.join(CACHE_DIR, 'readings-data.json')

const SOURCE_API = 'https://api.otaboyev-prep.uz/api'
const SOURCE_AUTH = process.env.SOURCE_TOKEN
  ? `Bearer ${process.env.SOURCE_TOKEN}`
  : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJicm9vb29vb21yQGdtYWlsLmNvbSIsImlhdCI6MTc3MjcyMTM0MSwiZXhwIjoxNzgwNDk3MzQxfQ.V9aUM-CJa20ese_Lw6BJHk_MGfzUmjHpXJ_QjHBWZG14LHmS7u4OmggsZ-PAR24fqCnkVD1D5T1ab_DaefVYpw'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '285233ea2f0c0de2e18ad9fe3cb335372c6d73e4c232eda058b7d5c45718fbc68ec47387be21676bba42f9f58cc1d03572229c5f877e9df83575fe93bfc1095b87bebc31438cf3c33ca7e423fd76929675a7769a2d28e56b8a4e81c72c5d33f1b408ae2bc9242075837f5569d7a9e853b99b41d4d53e729ad3e65593ed3e02d0'

// Optional --ids 3303,3293,3290 to override the list filter
const ARG_IDS = (() => {
  const i = process.argv.indexOf('--ids')
  if (i < 0) return null
  return process.argv[i + 1].split(',').map((s) => Number(s.trim()))
})()

// Pause between source API fetches (seconds). Spreads submit attempts on the source account.
const ARG_DELAY_SEC = (() => {
  const i = process.argv.indexOf('--delay')
  if (i < 0) return null
  return Number(process.argv[i + 1])
})()

// Question type mapping: source API → Strapi enum
const TYPE_MAP = {
  'TRUE_FALSE_NOT_GIVEN': 'tfng',
  'YES_NO_NOT_GIVEN': 'ynng',
  'MULTIPLE_CHOICE': 'mcq_single',
  'MULTIPLE_CHOICE_TWO': 'mcq_multiple',
  'SUMMARY_COMPLETION': 'summary_completion',
  'SUMMARY_COMPLETION_DRAG_DROP': 'summary_completion_drag_drop',
  'NOTE_COMPLETION': 'note_completion',
  'TABLE_COMPLETION': 'table_completion',
  'MATCHING_HEADINGS': 'matching_headings',
  'MATCHING_INFORMATION': 'matching_info',
  'MATCHING_NAMES': 'matching_names',
  'MATCHING_SENTENCE_ENDINGS': 'matching_sentence_endings',
  'SENTENCE_COMPLETION': 'sentence_completion',
  'FLOW_CHART_COMPLETION': 'flow_chart_completion',
}

// Difficulty mapping
const DIFF_MAP = {
  'EASY': 'easy',
  'MEDIUM': 'medium',
  'HARD': 'hard',
}

// ── Source API helpers ─────────────────────────────────────────────────────

async function fetchSourceList() {
  const res = await fetch(
    `${SOURCE_API}/readings?isPremium=false&isGold=false&page=0&size=100`,
    { headers: { Authorization: SOURCE_AUTH } }
  )
  return await res.json()
}

async function fetchSourceReading(id) {
  const res = await fetch(`${SOURCE_API}/readings/${id}`, {
    headers: { Authorization: SOURCE_AUTH },
  })
  return await res.json()
}

async function fetchCorrectAnswers(id, totalQuestions) {
  const answers = []
  for (let i = 1; i <= totalQuestions; i++) {
    answers.push({ questionNumber: i, answerText: null })
  }
  const res = await fetch(`${SOURCE_API}/readings/${id}/submit-by-number`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: SOURCE_AUTH,
    },
    body: JSON.stringify({ readingId: id, answers }),
  })
  return await res.json()
}

// ── Phase A: Fetch & Cache ────────────────────────────────────────────────

async function phaseA() {
  const cacheKey = ARG_IDS ? `readings-${ARG_IDS.join('-')}.json` : 'readings-data.json'
  const cacheFile = path.join(CACHE_DIR, cacheKey)

  if (fs.existsSync(cacheFile)) {
    console.log(`Cache exists at ${cacheFile}, skipping API fetches.`)
    return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
  }

  let targetItems
  if (ARG_IDS) {
    console.log(`Using ${ARG_IDS.length} explicit --ids`)
    targetItems = ARG_IDS.map((id) => ({ id, title: `(id ${id})`, playlist: null }))
  } else {
    console.log('Fetching reading list...')
    const listData = await fetchSourceList()
    const allItems = listData.content || listData
    targetItems = allItems.filter(
      (item) => item.playlist === null || item.playlist === 'Reading Challenge'
    )
    console.log(`Found ${targetItems.length} items to import`)
  }

  const cached = []

  for (const item of targetItems) {
    console.log(`  Fetching reading ${item.id}: ${item.title}...`)

    // Fetch full reading data
    const reading = await fetchSourceReading(item.id)

    // Count total questions across all parts
    let totalQ = 0
    for (const partKey of ['part1', 'part2', 'part3']) {
      const part = reading[partKey]
      if (!part) continue
      for (const qGroup of (part.questions || [])) {
        totalQ += (qGroup.questions || []).length
      }
    }

    console.log(`    ${totalQ} questions, fetching answers...`)

    // Fetch correct answers (ONLY ONCE per reading)
    const submitResult = await fetchCorrectAnswers(item.id, totalQ)

    cached.push({
      listItem: item,
      reading,
      submitResult,
    })

    // Pause between readings — defaults to 300ms but configurable via --delay <sec>
    const delayMs = ARG_DELAY_SEC != null ? ARG_DELAY_SEC * 1000 : 300
    if (delayMs > 0) {
      console.log(`    sleeping ${delayMs}ms...`)
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }

  // Save cache
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.writeFileSync(cacheFile, JSON.stringify(cached, null, 2))
  console.log(`Cached ${cached.length} readings to ${cacheFile}`)

  return cached
}

// ── Strapi helpers ────────────────────────────────────────────────────────

async function strapiCreate(collection, data) {
  const res = await fetch(`${STRAPI_URL}/api/${collection}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  })
  const json = await res.json()
  if (json.error) {
    throw new Error(`Strapi ${collection} create failed: ${json.error.message}`)
  }
  return json.data
}

// ── Phase B: Import to Strapi ─────────────────────────────────────────────

function mapQuestionType(sourceType, subQuestionCount) {
  // MULTIPLE_CHOICE with exactly 2 sub-questions = "choose two answers" = mcq_multiple
  if (sourceType === 'MULTIPLE_CHOICE' && subQuestionCount === 2) {
    return 'mcq_multiple'
  }
  return TYPE_MAP[sourceType] || 'gap_fill'
}

// Treat source "----" placeholder as empty.
function stripPlaceholder(s) {
  if (s == null) return ''
  const trimmed = String(s).trim()
  if (trimmed === '----' || trimmed === '---' || /^-+$/.test(trimmed)) return ''
  return s
}

// For richtext fields (instruction, context, explanation) — keep HTML but strip placeholder.
function cleanRichText(s) {
  return stripPlaceholder(s)
}

// For plain-text fields (question_text) — strip HTML tags, decode entities, drop placeholder.
function cleanText(s) {
  const v = stripPlaceholder(s)
  if (!v) return ''
  let t = String(v)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
  t = t.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return t
}

function buildAnswerMap(submitResult) {
  const map = {}
  for (const qr of (submitResult.questionResults || [])) {
    map[qr.questionNumber] = {
      correctAnswer: qr.correctAnswer,
      explanation: qr.explanation,
      questionType: qr.questionType,
      questionText: qr.questionText,
    }
  }
  return map
}

async function importReading(cached) {
  const { listItem, reading, submitResult } = cached
  const answerMap = buildAnswerMap(submitResult)

  const globalTitle = reading.globalTitle || listItem.title

  // Determine difficulty from first non-null part
  let difficulty = 'medium'
  for (const partKey of ['part1', 'part2', 'part3']) {
    if (reading[partKey]?.difficulty) {
      difficulty = DIFF_MAP[reading[partKey].difficulty] || 'medium'
      break
    }
  }

  // Create Test
  console.log(`  Creating test: ${globalTitle}`)
  const test = await strapiCreate('tests', {
    title: globalTitle,
    difficulty_level: difficulty,
    module_type: 'reading',
    is_published: true,
  })

  // Process each part
  for (const partKey of ['part1', 'part2', 'part3']) {
    const part = reading[partKey]
    if (!part) continue

    const partNumber = parseInt(partKey.replace('part', ''))

    // Create ReadingPassage
    console.log(`    Creating passage ${partNumber}: ${part.title}`)
    const passage = await strapiCreate('reading-passages', {
      test: test.documentId,
      passage_number: partNumber,
      title: part.title || globalTitle,
      content: part.content || '',
      word_count: part.wordCount || null,
      time_limit: part.timeLimitMinutes ? part.timeLimitMinutes * 60 : null,
    })

    // Process question groups
    for (let gi = 0; gi < (part.questions || []).length; gi++) {
      const srcGroup = part.questions[gi]
      const subQuestions = srcGroup.questions || []
      const mappedType = mapQuestionType(srcGroup.type, subQuestions.length)

      // For MCQ groups, the real prompt + options live on the GROUP, not the sub-questions.
      // The "context" field is only meaningful for shared-prompt types (TFNG, summary, etc.)
      const isMcqLike = mappedType === 'mcq_single' || mappedType === 'mcq_multiple'

      // Create QuestionGroup — instruction and context are richtext (keep HTML)
      const group = await strapiCreate('question-groups', {
        group_number: gi + 1,
        question_type: mappedType,
        instruction: cleanRichText(srcGroup.instruction),
        context: isMcqLike ? '' : cleanRichText(srcGroup.questionText),
        points: srcGroup.points || subQuestions.length,
        reading_passage: passage.documentId,
        options: srcGroup.options || null,
        metadata: {
          source_id: srcGroup.id,
          source_type: srcGroup.type,
          tableData: srcGroup.tableData || null,
          headingOptions: srcGroup.headingOptions || null,
        },
      })

      // Handle edge case: MCQ groups where the group itself IS the question
      // (0 sub-questions, questionNumber/questionText/options on the group)
      const questionsToCreate = subQuestions.length > 0
        ? subQuestions
        : (srcGroup.questionNumber ? [srcGroup] : [])

      // Create individual questions
      for (const subQ of questionsToCreate) {
        const answer = answerMap[subQ.questionNumber] || {}
        // For MCQ-like groups, the real prompt + options live on the group, not the sub.
        // The sub typically has questionText="----" and no options.
        const subText = cleanText(subQ.questionText)
        const groupText = cleanText(srcGroup.questionText)
        const questionText = isMcqLike
          ? (subText || groupText || cleanText(answer.questionText))
          : (subText || cleanText(answer.questionText))
        const opts = (subQ.options && subQ.options.length ? subQ.options : null)
          || (isMcqLike ? srcGroup.options : null)
          || null

        await strapiCreate('questions', {
          module_type: 'reading',
          reading_passage: passage.documentId,
          question_group: group.documentId,
          question_number: subQ.questionNumber,
          question_type: mappedType,
          question_text: questionText,
          options: opts,
          correct_answer: answer.correctAnswer || '',
          explanation: cleanText(answer.explanation),
          points: subQ.points || 1,
          metadata: {
            source_question_id: subQ.id,
          },
        })
      }
    }
  }

  console.log(`  ✓ Done: ${globalTitle}`)
}

async function phaseB(cachedData) {
  console.log(`\nImporting ${cachedData.length} readings to Strapi...`)

  for (let i = 0; i < cachedData.length; i++) {
    console.log(`\n[${i + 1}/${cachedData.length}] ${cachedData[i].listItem.title}`)
    try {
      await importReading(cachedData[i])
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`)
    }
  }

  console.log('\nImport complete!')
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const fetchOnly = process.argv.includes('--fetch-only')
  console.log('=== Reading Import Script ===\n')

  const cachedData = await phaseA()

  if (fetchOnly) {
    console.log('\n--fetch-only: Skipping Strapi import. Run without flag to import.')
    return
  }

  await phaseB(cachedData)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
