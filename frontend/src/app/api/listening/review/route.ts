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

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const attemptId = searchParams.get("attemptId");

  if (!attemptId) {
    return NextResponse.json(
      { error: "attemptId is required" },
      { status: 400 }
    );
  }

  // Fetch the test attempt
  const attempts = await find("test-attempts", {
    filters: {
      documentId: { $eq: attemptId },
      user: { id: { $eq: user.id } },
    },
    populate: { test: { fields: ["audio_url"] } },
  });

  const attempt = attempts?.[0];
  if (!attempt) {
    return NextResponse.json(
      { error: "Test attempt not found" },
      { status: 404 }
    );
  }

  const testDocId = attempt.test?.documentId;
  const audioUrl = attempt.test?.audio_url || "";

  // Fetch sections with questions and question groups populated
  const sections = await find("listening-sections", {
    filters: { test: { documentId: { $eq: testDocId } } },
    sort: ["section_number"],
    populate: {
      questions: {
        sort: ["question_number"],
        fields: ["question_number", "question_type", "question_text", "options", "metadata", "correct_answer"],
        populate: {
          question_group: {
            fields: ["group_number", "question_type", "instruction", "context", "points", "options", "metadata"],
          },
        },
      },
    },
  });

  // Fetch user answers for this attempt
  const userAnswers = await find("user-answers", {
    filters: { test_attempt: { documentId: { $eq: attemptId } } },
    populate: ["question"],
  });

  const userAnswersMap = new Map(
    (userAnswers ?? []).map((ua: any) => [ua.question?.documentId, ua])
  );

  const allQuestions = (sections ?? []).flatMap((s: any) => s.questions ?? []);
  const enrichedUserAnswers = allQuestions.map((q: any) => {
    const ua = userAnswersMap.get(q.documentId);
    return {
      question_id: q.documentId,
      user_answer: ua?.user_answer || "",
      is_correct: ua?.is_correct ?? false,
      correct_answer: q.correct_answer || "",
    };
  });

  const sectionsWithQuestions = (sections ?? []).map((section: any) => {
    const questions = (section.questions ?? []).map((q: any) => ({
      id: q.documentId,
      questionNumber: q.question_number,
      type: q.question_type,
      text: q.question_text,
      options: normalizeOptions(q.options),
      metadata: q.metadata,
      _groupId: q.question_group?.documentId ?? null,
    }));

    // Build question groups
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

    for (const q of questions) {
      if (q._groupId && groupMap.has(q._groupId)) {
        const { _groupId, ...cleanQ } = q;
        groupMap.get(_groupId).questions.push(cleanQ);
      }
    }

    const questionGroups = [...groupMap.values()].sort(
      (a: any, b: any) => a.groupNumber - b.groupNumber
    );

    const cleanQuestions = questions.map(({ _groupId, ...q }: any) => q);

    return {
      id: section.documentId,
      sectionNumber: section.section_number,
      transcript: section.transcript,
      questionGroups,
      questions: cleanQuestions,
    };
  });

  return NextResponse.json({
    audioUrl,
    sections: sectionsWithQuestions,
    userAnswers: enrichedUserAnswers,
  });
}
