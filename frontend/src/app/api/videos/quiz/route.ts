import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { geminiFlash } from "@/lib/gemini";
import { findOne, update, find } from "@/lib/strapi/api";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
}

async function generateQuiz(transcript: string): Promise<QuizQuestion[]> {
  const truncated = transcript.slice(0, 12000);

  const prompt = `You are an IELTS preparation assistant. Based on the following video transcript, generate exactly 5 multiple-choice quiz questions that test comprehension and IELTS-relevant skills.

TRANSCRIPT:
${truncated}

Return a JSON array of exactly 5 objects with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Brief explanation of why this answer is correct."
  }
]

Rules:
- Questions must be based strictly on the transcript content
- Each question must have exactly 4 options
- "answer" is the 0-based index of the correct option
- Make questions relevant to IELTS skills (vocabulary, main idea, inference, detail, tone)
- Return ONLY valid JSON, no markdown or extra text`;

  const result = await geminiFlash.generateContent(prompt);
  const text = result.response.text().trim();

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No JSON array found in Gemini response");

  return JSON.parse(jsonMatch[0]) as QuizQuestion[];
}

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();
    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    // Load video lesson from Strapi
    const lessons = await find("video-lessons", {
      filters: { documentId: { $eq: videoId } },
      fields: ["youtube_id", "transcript", "quiz_questions"],
    });
    const lesson = lessons[0];

    if (!lesson) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Return cached quiz if it exists
    if (Array.isArray(lesson.quiz_questions) && lesson.quiz_questions.length > 0) {
      return NextResponse.json({ questions: lesson.quiz_questions });
    }

    // Fetch transcript
    let transcript: string;
    if (lesson.transcript) {
      transcript = lesson.transcript;
    } else {
      const segments = await YoutubeTranscript.fetchTranscript(lesson.youtube_id);
      transcript = segments.map((s: { text: string }) => s.text).join(" ");

      // Cache transcript in Strapi
      await update("video-lessons", lesson.documentId, { transcript });
    }

    // Generate quiz with Gemini
    const questions = await generateQuiz(transcript);

    // Cache quiz in Strapi
    await update("video-lessons", lesson.documentId, { quiz_questions: questions });

    return NextResponse.json({ questions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[videos/quiz]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "videoId is required" }, { status: 400 });
  }

  const lesson = await findOne("video-lessons", videoId, {
    fields: ["quiz_questions"],
  });

  if (!lesson) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  return NextResponse.json({
    questions: lesson.quiz_questions ?? [],
  });
}
