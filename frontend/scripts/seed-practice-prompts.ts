/**
 * Seeds conversation starters for the AI speaking practice section, then
 * pre-generates the spoken audio for each opening question.
 *
 * The pre-generation is the point: TTS output is the single largest cost line
 * in a practice session, and every learner who picks a topic hears the same
 * opening sentence. Synthesizing it once here instead of per-session removes
 * that cost entirely.
 *
 *   npx tsx scripts/seed-practice-prompts.ts                      # all, with audio
 *   npx tsx scripts/seed-practice-prompts.ts --audio-only         # voice existing rows
 *   npx tsx scripts/seed-practice-prompts.ts --no-audio --limit=1 # one text-only card
 *
 * Needs STRAPI_API_TOKEN plus the usual Vertex env (GOOGLE_CLOUD_PROJECT etc),
 * read from frontend/.env.local. Vertex env is only touched when synthesizing,
 * so --no-audio runs with the Strapi token alone.
 */

import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(__dirname, "../.env.local") });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error("Missing STRAPI_API_TOKEN — expected in frontend/.env.local");
  process.exit(1);
}

const AUDIO_ONLY = process.argv.includes("--audio-only");
const NO_AUDIO = process.argv.includes("--no-audio");
const LIMIT = Number(
  process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? NaN
);

interface PromptSeed {
  title: string;
  category: "daily_life" | "work_study" | "travel" | "opinion" | "describe";
  difficulty: "beginner" | "intermediate" | "advanced";
  opening_question: string;
  follow_up_hints: string[];
  /** Part 2 cue card — prompts with one also offer IELTS examiner mode. */
  cue_card?: { topic: string; bullets: string[] };
}

// Opening questions are deliberately Part-2-style: one spoken prompt that names
// a topic and lists a few things to cover, so the learner's very first answer is
// already a long turn, not a one-liner. The AI keeps this style going after.
const prompts: PromptSeed[] = [
  // ─── Beginner ──────────────────────────────────────────────────────────
  {
    title: "Your typical day",
    category: "daily_life",
    difficulty: "beginner",
    opening_question:
      "Hi! Let's start with your daily routine. Describe a normal day for you — tell me what you do in the morning, how you spend the middle of the day, what your evening looks like, and which part of the day you enjoy most.",
    follow_up_hints: ["morning routine", "breakfast habits", "commute", "weekday vs weekend"],
    cue_card: {
      topic: "Describe a typical day in your life",
      bullets: [
        "what you do in the morning",
        "how you spend the middle of the day",
        "what your evenings are like",
        "and explain which part of the day you enjoy most",
      ],
    },
  },
  {
    title: "Food and cooking",
    category: "daily_life",
    difficulty: "beginner",
    opening_question:
      "Let's talk about food. Describe a meal you really enjoy — tell me what it is, who usually makes it, when you eat it, and why you like it so much.",
    follow_up_hints: ["who cooks", "favourite meal", "eating out", "food they dislike"],
    cue_card: {
      topic: "Describe a meal you really enjoyed",
      bullets: [
        "what the meal was",
        "where and when you had it",
        "who you shared it with",
        "and explain why you enjoyed it so much",
      ],
    },
  },
  {
    title: "Your hometown",
    category: "describe",
    difficulty: "beginner",
    opening_question:
      "I'd love to hear about where you're from. Describe your hometown — tell me where it is, what it looks like, what people there like to do, and how you feel about it now.",
    follow_up_hints: ["big city or small town", "what changed", "best part", "would they move back"],
    cue_card: {
      topic: "Describe the place where you grew up",
      bullets: [
        "where it is",
        "what it looks like",
        "what people there usually do",
        "and explain how you feel about it now",
      ],
    },
  },
  {
    title: "Free time",
    category: "daily_life",
    difficulty: "beginner",
    opening_question:
      "Let's talk about your free time. Describe a hobby or activity you enjoy — tell me what it is, how you got into it, how often you do it, and why you like it.",
    follow_up_hints: ["hobbies", "alone or with friends", "how it started", "time they wish they had"],
    cue_card: {
      topic: "Describe a hobby or activity you enjoy in your free time",
      bullets: [
        "what the activity is",
        "when and how you started it",
        "how often you do it",
        "and explain why you enjoy it",
      ],
    },
  },

  // ─── Intermediate ──────────────────────────────────────────────────────
  {
    title: "Work and study",
    category: "work_study",
    difficulty: "intermediate",
    opening_question:
      "Let's talk about what keeps you busy. Describe your work or your studies — tell me what you do, why you chose it, what a typical day is like, and where you'd like it to take you.",
    follow_up_hints: ["why they chose it", "hardest part", "typical day", "where they see it going"],
    cue_card: {
      topic: "Describe your work or your studies",
      bullets: [
        "what you do",
        "why you chose it",
        "what a typical day involves",
        "and explain where you hope it will lead",
      ],
    },
  },
  {
    title: "A trip you remember",
    category: "travel",
    difficulty: "intermediate",
    opening_question:
      "Let's talk about travel. Describe a trip that really stayed with you — tell me where you went, who you were with, what you did there, and why it was so memorable.",
    follow_up_hints: ["who they went with", "what surprised them", "food and people", "would they return"],
    cue_card: {
      topic: "Describe a journey you remember well",
      bullets: [
        "where you went",
        "who you travelled with",
        "what happened during the journey",
        "and explain why you remember it so well",
      ],
    },
  },
  {
    title: "Technology in your life",
    category: "opinion",
    difficulty: "intermediate",
    opening_question:
      "Let's talk about technology. Describe a device or app you use every day — tell me what it is, what you use it for, how often you use it, and how your life would be different without it.",
    follow_up_hints: ["phone habits", "life before smartphones", "something they'd give up", "effect on friendships"],
    cue_card: {
      topic: "Describe a piece of technology you use every day",
      bullets: [
        "what it is",
        "how often you use it",
        "what you use it for",
        "and explain how your life would change without it",
      ],
    },
  },
  {
    title: "Learning English",
    category: "work_study",
    difficulty: "intermediate",
    opening_question:
      "Let's talk about learning English. Describe your English-learning journey — tell me how you started, what's been the hardest part, where you use English now, and what your goal is.",
    follow_up_hints: ["speaking vs writing", "what helped most", "where they use English", "their goal"],
    cue_card: {
      topic: "Describe a language-learning experience you remember",
      bullets: [
        "what the experience was",
        "when and where it happened",
        "what you learned from it",
        "and explain why it stayed with you",
      ],
    },
  },
  {
    title: "A person who influenced you",
    category: "describe",
    difficulty: "intermediate",
    opening_question:
      "Let's talk about someone important to you. Describe a person who has really influenced you — tell me who they are, how you know them, what they've done, and how they've shaped who you are.",
    follow_up_hints: ["how they met", "what they learned", "still in touch", "advice that stuck"],
    cue_card: {
      topic: "Describe a person who has influenced you",
      bullets: [
        "who the person is",
        "how you know them",
        "what they have done that impressed you",
        "and explain how they have influenced your life",
      ],
    },
  },

  // ─── Advanced ──────────────────────────────────────────────────────────
  {
    title: "Work-life balance",
    category: "opinion",
    difficulty: "advanced",
    opening_question:
      "Let's talk about work-life balance. Describe how you try to balance work or study with the rest of your life — tell me what a balanced week looks like for you, what usually gets in the way, how you protect your free time, and whether you think real balance is actually possible these days.",
    follow_up_hints: ["cultural differences", "remote work", "generational shift", "their own boundaries"],
    cue_card: {
      topic: "Describe how you balance work or study with the rest of your life",
      bullets: [
        "what a balanced week looks like for you",
        "what usually gets in the way",
        "how you try to protect your free time",
        "and explain whether you think real balance is achievable",
      ],
    },
  },
  {
    title: "Cities and the environment",
    category: "opinion",
    difficulty: "advanced",
    opening_question:
      "Let's talk about cities and the environment. Describe the environmental challenges facing a city you know well — tell me what the main problems are, what's causing them, what's being done about them, and what you think should change.",
    follow_up_hints: ["public transport", "individual vs government responsibility", "their own city", "realistic trade-offs"],
    cue_card: {
      topic: "Describe the environmental challenges facing a city you know",
      bullets: [
        "what the main problems are",
        "what is causing them",
        "what is being done about them",
        "and explain what you think should change",
      ],
    },
  },
  {
    title: "Tradition versus change",
    category: "opinion",
    difficulty: "advanced",
    opening_question:
      "Let's talk about tradition and change. Describe a tradition from your culture that's fading as life modernises — tell me what it is, why it mattered, why it's disappearing, and whether you think that's a loss worth resisting.",
    follow_up_hints: ["a tradition they value", "what younger people think", "language and identity", "who decides"],
    cue_card: {
      topic: "Describe a tradition from your culture that is fading",
      bullets: [
        "what the tradition is",
        "why it mattered",
        "why it is disappearing",
        "and explain whether you think that is a loss",
      ],
    },
  },
];

async function strapi(path: string, init?: RequestInit) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/** Synthesize the opening question and attach it to the prompt row. */
async function attachAudio(documentId: string, id: number, text: string, title: string) {
  // Imported lazily so --no-audio never needs the Vertex credentials.
  const { synthesizeSpeech } = await import("../src/lib/tts");
  const speech = await synthesizeSpeech(text);
  if (!speech) {
    console.warn(`  ⚠ TTS failed for "${title}" — the runner will fall back to text-only`);
    return;
  }

  const base64 = speech.dataUri.split(",")[1];
  const buffer = Buffer.from(base64, "base64");
  const extension = speech.mimeType.split("/")[1] ?? "wav";

  const form = new FormData();
  form.append("files", new Blob([buffer], { type: speech.mimeType }), `practice-${documentId}.${extension}`);
  form.append("ref", "api::practice-prompt.practice-prompt");
  form.append("refId", String(id));
  form.append("field", "opening_audio");

  await strapi("/upload", { method: "POST", body: form });
  console.log(`  ♪ audio attached (${(buffer.length / 1024).toFixed(0)}KB)`);
}

async function main() {
  const existing = await strapi(
    "/practice-prompts?pagination[limit]=200&populate=opening_audio&fields[0]=title&fields[1]=cue_card&fields[2]=opening_question"
  );
  type Row = {
    documentId: string;
    id: number;
    opening_audio: unknown;
    cue_card: unknown;
    opening_question: string;
  };
  const byTitle = new Map<string, Row>(
    (existing.data ?? []).map((p: Row & { title: string }) => [
      p.title,
      {
        documentId: p.documentId,
        id: p.id,
        opening_audio: p.opening_audio,
        cue_card: p.cue_card,
        opening_question: p.opening_question,
      },
    ])
  );

  const targets = Number.isFinite(LIMIT) ? prompts.slice(0, LIMIT) : prompts;

  let created = 0;
  let voiced = 0;
  let updated = 0;

  for (const prompt of targets) {
    let row = byTitle.get(prompt.title);

    if (!row && !AUDIO_ONLY) {
      const res = await strapi("/practice-prompts", {
        method: "POST",
        body: JSON.stringify({ data: { ...prompt, is_active: true } }),
      });
      row = {
        documentId: res.data.documentId,
        id: res.data.id,
        opening_audio: null,
        cue_card: prompt.cue_card ?? null,
        opening_question: prompt.opening_question,
      };
      created++;
      console.log(`✓ created "${prompt.title}"`);
    }

    if (!row) continue;

    // Patch drifted content: a changed opening question (needs fresh audio) or
    // a missing cue card. Leaves anything already correct untouched.
    const questionChanged = row.opening_question !== prompt.opening_question;
    const needsCueCard = !!prompt.cue_card && !row.cue_card;
    if (questionChanged || needsCueCard) {
      const data: Record<string, unknown> = {};
      if (questionChanged) data.opening_question = prompt.opening_question;
      if (needsCueCard) data.cue_card = prompt.cue_card;
      await strapi(`/practice-prompts/${row.documentId}`, {
        method: "PUT",
        body: JSON.stringify({ data }),
      });
      updated++;
      console.log(
        `↻ updated "${prompt.title}"${questionChanged ? " (question)" : ""}${needsCueCard ? " (cue card)" : ""}`
      );
    }

    // Voice when there's no audio yet, or re-voice when the question changed so
    // the recording matches the new text. (Old audio file is left orphaned.)
    if (!NO_AUDIO && (!row.opening_audio || questionChanged)) {
      await attachAudio(row.documentId, row.id, prompt.opening_question, prompt.title);
      voiced++;
    }
  }

  console.log(
    `\nDone. ${created} created, ${updated} updated, ${voiced} voiced, ${targets.length} processed.` +
      (NO_AUDIO ? "\nText-only (--no-audio): opening question shown without audio." : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
