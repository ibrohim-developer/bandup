import { NextResponse } from 'next/server'
import { find } from '@/lib/strapi/api'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET() {
  // Fetch passages with test and questions populated
  const passages = await find('reading-passages', {
    filters: { test: { is_published: { $eq: true } } },
    populate: {
      test: { fields: ['title', 'description', 'difficulty_level', 'is_published'] },
      questions: { fields: ['question_number'] },
    },
  })

  if (!passages?.length) {
    return NextResponse.json([])
  }

  const testMap = new Map<string, any>()
  passages.forEach((passage: any) => {
    const test = passage.test
    if (!test) return
    const testDocId = test.documentId
    if (!testMap.has(testDocId)) {
      testMap.set(testDocId, {
        id: testDocId,
        title: test.title,
        description: test.description ?? '',
        difficulty: test.difficulty_level ?? 'medium',
        duration: 60,
        questions: 0,
        passages: 0,
      })
    }
    const testData = testMap.get(testDocId)
    testData.passages += 1
    testData.questions += (passage.questions ?? []).length
  })

  return NextResponse.json(Array.from(testMap.values()), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
