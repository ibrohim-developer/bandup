import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Normalize options: convert [{key, text}] or [{optionKey, optionText}] objects to string[] */
function normalizeOptions(options: any): string[] | null {
  if (!options || !Array.isArray(options)) return null;
  if (options.length === 0) return [];
  if (typeof options[0] === 'string') return options;
  if (typeof options[0] === 'object') {
    if (options[0].text !== undefined) {
      return options.map((o: any) => o.text || o.key || '');
    }
    if (options[0].optionText !== undefined) {
      return options.map((o: any) => o.optionText || o.optionKey || '');
    }
  }
  return options;
}

/** Check if group options represent a flow chart (objects with HTML content containing blanks) */
function isFlowChartOptions(options: any): boolean {
  if (!options || !Array.isArray(options) || options.length === 0) return false;
  const first = options[0];
  if (typeof first !== 'object') return false;
  const text = first.text || first.optionText || '';
  return typeof text === 'string' && (text.includes('<') || text.includes('______'));
}

/** Keep flow chart options as {optionKey, optionText} for the FlowChart component */
function normalizeFlowChartOptions(options: any): any[] | null {
  if (!options || !Array.isArray(options)) return null;
  return options.map((o: any, i: number) => ({
    optionKey: o.key || o.optionKey || String.fromCharCode(65 + i),
    optionText: o.text || o.optionText || '',
    orderIndex: i,
  }));
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { testId } = await request.json();
  if (!testId) {
    return NextResponse.json({ error: "testId is required" }, { status: 400 });
  }

  // Fetch listening sections with questions and their question groups
  const sections = await find("listening-sections", {
    filters: { test: { documentId: { $eq: testId } } },
    sort: ["section_number"],
    populate: {
      questions: {
        sort: ["question_number"],
        fields: ["question_number", "question_type", "question_text", "options", "metadata"],
        populate: {
          question_group: {
            fields: ["group_number", "question_type", "instruction", "context", "points", "options", "metadata"],
          },
        },
      },
    },
  });

  if (!sections?.length) {
    return NextResponse.json(
      { error: "No sections found for this test" },
      { status: 404 }
    );
  }

  const sectionsWithQuestions = sections.map((section: any) => {
    const questions = (section.questions ?? []).map((q: any) => ({
      id: q.documentId,
      questionNumber: q.question_number,
      type: q.question_type,
      text: q.question_text,
      options: normalizeOptions(q.options),
      metadata: q.metadata,
      _groupId: q.question_group?.documentId ?? null,
    }));

    // Build question groups from individual question→group relations
    const groupMap = new Map<string, any>();
    for (const q of section.questions ?? []) {
      const g = q.question_group;
      if (g && !groupMap.has(g.documentId)) {
        groupMap.set(g.documentId, {
          id: g.documentId,
          groupNumber: g.group_number,
          type: g.question_type,
          instruction: g.instruction,
          context: g.context || null,
          points: g.points,
          options: isFlowChartOptions(g.options) ? normalizeFlowChartOptions(g.options) : normalizeOptions(g.options),
          metadata: g.metadata,
          questions: [],
        });
      }
    }

    // Assign questions to their groups
    for (const q of questions) {
      if (q._groupId && groupMap.has(q._groupId)) {
        const { _groupId, ...cleanQ } = q;
        groupMap.get(_groupId).questions.push(cleanQ);
      }
    }

    const questionGroups = [...groupMap.values()].sort(
      (a: any, b: any) => a.groupNumber - b.groupNumber
    );

    // Clean _groupId from questions
    const cleanQuestions = questions.map(({ _groupId, ...q }: any) => q);

    return {
      id: section.documentId,
      sectionNumber: section.section_number,
      audioUrl: section.audio_url,
      audioDurationSeconds: section.audio_duration_seconds,
      transcript: section.transcript,
      timeLimit: section.time_limit,
      questionGroups,
      questions: cleanQuestions,
    };
  });

  const totalTimeLimit = sections.reduce(
    (sum: number, s: any) => sum + (s.time_limit || 0),
    0
  );

  return NextResponse.json({
    totalTimeLimit,
    sections: sectionsWithQuestions,
  });
}
