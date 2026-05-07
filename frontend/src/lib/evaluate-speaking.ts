import { vertexAI, MODEL_PRO } from "./gemini";
import { logAIUsage } from "./ai-usage";

export interface SpeakingEvaluation {
  transcript: string;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  overallBandScore: number;
  feedback: Record<string, unknown>;
}

function roundToNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

const BAND_DESCRIPTORS = `
OFFICIAL IELTS SPEAKING BAND DESCRIPTORS (condensed, public).
Use these as your scoring anchors. Do NOT default to Band 6-7 — calibrate carefully.

=== FLUENCY AND COHERENCE ===
Band 9: Speaks fluently with only rare repetition or self-correction. Any hesitation is content-related, not language search. Develops topics fully and coherently.
Band 8: Speaks fluently with only occasional repetition or self-correction. Hesitation is usually content-related, rarely to search for language. Develops topics coherently and appropriately.
Band 7: Speaks at length without noticeable effort or loss of coherence. Some language-related hesitation, repetition or self-correction. Uses a range of connectives and discourse markers with some flexibility.
Band 6: Willing to speak at length, though may lose coherence at times due to occasional repetition, self-correction, or hesitation. Uses connectives and discourse markers but not always appropriately.
Band 5: Usually maintains flow but uses repetition, self-correction and/or slow speech to keep going. Over-uses certain connectives. Simple speech is fluent but more complex communication causes fluency problems.
Band 4: Cannot respond without noticeable pauses. Speech may be slow, with frequent repetition. Links basic sentences with repetitious use of simple connectives. Some breakdowns.
Band 3: Speaks with long pauses. Limited ability to link simple sentences. Frequently unable to convey basic message.
Band 2: Pauses lengthily before most words. Little communication possible.

=== LEXICAL RESOURCE ===
Band 9: Full flexibility and precision across all topics. Uses idiomatic language naturally and accurately.
Band 8: Wide resource used readily and flexibly. Uses less common and idiomatic vocabulary skilfully, with occasional inaccuracies. Paraphrases effectively.
Band 7: Flexible use across a variety of topics. Uses some less common and idiomatic vocabulary with awareness of style/collocation, with some inappropriate choices. Paraphrases effectively.
Band 6: Wide enough vocabulary to discuss topics at length and make meaning clear despite inappropriacies. Generally paraphrases successfully.
Band 5: Manages familiar and unfamiliar topics but with limited flexibility. Attempts paraphrase with mixed success.
Band 4: Talks about familiar topics; can only convey basic meaning on unfamiliar ones. Frequent errors in word choice. Rarely paraphrases.
Band 3: Simple vocabulary to convey personal information. Insufficient vocabulary for less familiar topics.

=== GRAMMATICAL RANGE AND ACCURACY ===
Band 9: Full range used naturally and appropriately. Consistently accurate apart from native-speaker-style 'slips'.
Band 8: Wide range used flexibly. Majority of sentences error-free, occasional non-systematic errors.
Band 7: Range of complex structures with some flexibility. Frequently produces error-free sentences though some mistakes persist.
Band 6: Mix of simple and complex structures with limited flexibility. May make frequent mistakes with complex structures, though these rarely cause comprehension problems.
Band 5: Basic sentence forms with reasonable accuracy. Limited range of complex structures, usually with errors that may cause comprehension problems.
Band 4: Basic sentence forms with some correct simple sentences. Subordinate structures rare. Errors frequent and may lead to misunderstanding.
Band 3: Attempts basic forms with limited success, or relies on memorised utterances. Numerous errors except in memorised expressions.

=== PRONUNCIATION ===
Band 9: Full range of pronunciation features with precision and subtlety. Effortless to understand.
Band 8: Wide range of pronunciation features. Flexible use sustained with only occasional lapses. Easy to understand throughout; L1 accent has minimal effect.
Band 7: All positive features of Band 6 and some (but not all) features of Band 8. Generally easy to understand; L1 accent has only minor effect.
Band 6: Range of pronunciation features with mixed control. Some effective use of features but not sustained. Generally understandable, though mispronunciation of individual words/sounds reduces clarity at times.
Band 5: All positive features of Band 4 and some (but not all) features of Band 6. Mispronunciations cause occasional difficulty.
Band 4: Limited range of pronunciation features. Attempts control but lapses are frequent. Mispronunciations frequent and cause some difficulty for listener.
Band 3: Some Band 2 features and some (but not all) Band 4 features. Frequently unintelligible.

=== CRITICAL SCORING RULES ===
- ACCENT IS NOT PENALISED. A strong L1 accent (Russian, Chinese, Indian, Arabic, etc.) is fine as long as it does not impede intelligibility. Score on whether you can understand, not on whether the accent is "neutral".
- INSUFFICIENT CONTENT RULE: A candidate must produce enough language to BE assessed. If the response is just a few words or a few seconds long, the candidate has not demonstrated the features required for Band 5 or higher in ANY criterion — including Pronunciation. A clearly-spoken 8-word sentence is NOT Band 5 pronunciation; it is Band 3 because there is not enough speech to assess range or sustained control. The same logic applies to Lexical Resource and Grammar — you cannot judge "range" from one sentence.
- OFF-TOPIC: if the candidate does not address the question (e.g. answers "I tested one thing" to a question about hobbies), there is no on-topic language to grade. Score all four criteria at Band 3 or below. Do NOT assign Band 5 pronunciation just because the few off-topic words were clearly spoken.
- MEMORISED RESPONSES: if the speech sounds rehearsed/scripted, cap Lexical Resource at Band 5 and note this.
- VERY SHORT ANSWERS: Part 2 monologue under 60 seconds, or Part 1/3 answers under ~15 words, indicate the candidate cannot sustain speech — this is Band 4 or below across all criteria.
- SILENCE / NO AUDIO: if the recording is silent, unintelligible, or contains no candidate speech, return all bands as 0 and note "No audible response."
- Do NOT inflate. If you find yourself wanting to give Band 7 across the board, ask: does this speech actually demonstrate "frequent error-free sentences" and "less common vocabulary with awareness of collocation"? If not, it is Band 6 or below.
- Bands 8-9 require near-native ease. Be very strict.
- Score each criterion INDEPENDENTLY based on its own descriptor. BUT remember: every criterion needs sustained evidence. Five seconds of speech cannot earn Band 5+ in any criterion, no matter how clean.
`.trim();

const SYSTEM_PROMPT = `You are a certified IELTS Speaking examiner with 10+ years of experience. You receive an audio recording of a candidate's response and grade strictly using the official IELTS public band descriptors.

${BAND_DESCRIPTORS}

You MUST output ONLY valid JSON matching the requested schema. No markdown, no commentary outside JSON.`;

function getPartGuidance(partNumber: number): string {
  if (partNumber === 1) {
    return `IELTS SPEAKING PART 1 — Introduction & Interview (4-5 min total).
- Short Q&A about familiar topics (home, work, study, hobbies, daily life).
- Expected answer length per question: 2-4 sentences (~15-40 seconds).
- Over-elaboration is unnecessary; one-word answers are too short.
- Look for: natural conversational flow, clarity, basic accuracy.`;
  }
  if (partNumber === 2) {
    return `IELTS SPEAKING PART 2 — Long Turn / Cue Card (3-4 min total: 1 min prep + 1-2 min monologue).
- Candidate must speak for 1-2 minutes UNINTERRUPTED on the cue card topic.
- Must address ALL bullet points on the cue card.
- CRITICAL: if monologue is under 60 seconds, this signals Fluency weakness — penalise accordingly.
- Look for: extended discourse, organisation, ability to develop ideas without interlocutor support, range of structures and vocabulary used over a longer turn.`;
  }
  return `IELTS SPEAKING PART 3 — Discussion (4-5 min).
- Abstract/analytical discussion related to the Part 2 topic.
- Candidate must give opinions, justify them, speculate, compare, evaluate.
- Expected answer length per question: 30-60 seconds with developed reasoning.
- Look for: ability to handle abstract ideas, justify and develop opinions, use of complex structures, hedging language ("I would argue...", "It depends on...").`;
}

// Final cost guard before calling Gemini. If anything slipped past upload (admin imports, future
// API entry points, etc.), we still refuse to spend money on suspiciously large audio.
const MAX_AUDIO_BYTES_FOR_EVAL = 3 * 1024 * 1024;

export async function evaluateSpeaking(
  questionText: string,
  topicName: string,
  partNumber: number,
  audioBuffer: Buffer,
  userId?: number | string | null,
  audioMimeType: string = "audio/webm"
): Promise<SpeakingEvaluation | null> {
  if (audioBuffer.byteLength > MAX_AUDIO_BYTES_FOR_EVAL) {
    console.error(
      `[evaluateSpeaking] Audio too large (${audioBuffer.byteLength} bytes) — refusing to call Gemini.`
    );
    await logAIUsage({
      userId: userId ?? null,
      module: "speaking",
      model: MODEL_PRO,
      usage: undefined,
      success: false,
      context: {
        part_number: partNumber,
        topic: topicName,
        error: "audio_too_large",
        bytes: audioBuffer.byteLength,
      },
    });
    return null;
  }

  try {
    const base64Audio = audioBuffer.toString("base64");

    const partGuidance = getPartGuidance(partNumber);

    const userPrompt = `${partGuidance}

TOPIC: ${topicName}
QUESTION: ${questionText}

Listen to the audio recording carefully, then evaluate.

Step 1: Transcribe the audio accurately. Note any long pauses, hesitations ("um", "uh"), or self-corrections — these matter for Fluency scoring.
Step 2: Check on-topic and not memorised/scripted.
Step 3: Score each of the 4 criteria INDEPENDENTLY using the band descriptors. Do not anchor all four to the same band.
Step 4: For each criterion, quote 2 short evidence phrases from the candidate's actual transcript.
Step 5: Compute overall_band as the arithmetic mean of the 4 criterion scores, rounded to the nearest 0.5.

OUTPUT JSON SCHEMA:
{
  "transcript": "full accurate transcription including audible hesitations like 'um', 'uh'",
  "audio_quality": "clear|noisy|silent|unintelligible",
  "duration_estimate_seconds": number,
  "on_topic": boolean,
  "sounds_memorised": boolean,
  "overall_band": number,
  "criterion_scores": {
    "fluency_and_coherence": number,
    "lexical_resource": number,
    "grammatical_range_and_accuracy": number,
    "pronunciation": number
  },
  "summary": {
    "strengths": [string, string, string],
    "weaknesses": [string, string, string]
  },
  "criterion_feedback": {
    "fluency_and_coherence": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    },
    "lexical_resource": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    },
    "grammatical_range_and_accuracy": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    },
    "pronunciation": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    }
  },
  "grammar_corrections": [
    { "original": string, "corrected": string, "explanation": string }
  ],
  "vocabulary_improvements": [
    { "original": string, "better": string, "reason": string }
  ],
  "pronunciation_notes": [
    { "word": string, "issue": string, "suggestion": string }
  ],
  "top_5_actions": [string, string, string, string, string]
}

ADDITIONAL RULES:
- Transcript must include audible filler words ("um", "uh", "like") — these are evidence for Fluency scoring.
- evidence_quotes must be exact phrases from the transcript, max 12 words each.
- grammar_corrections: 3-8 items unless the speech is exceptionally clean.
- pronunciation_notes: focus on words/sounds that genuinely reduced intelligibility, NOT accent features. 2-5 items, fewer if pronunciation is strong.
- top_5_actions: concrete, actionable items the candidate can practise.
- If audio is silent or unintelligible: set all criterion scores to 0, transcript to "(no audible response)", and explain in feedback.
- Be concise inside JSON strings.

Return ONLY JSON.`;

    const result = await vertexAI.models.generateContent({
      model: MODEL_PRO,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: audioMimeType,
                data: base64Audio,
              },
            },
            { text: userPrompt },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const content = result.text;
    if (!content) {
      await logAIUsage({
        userId: userId ?? null,
        module: "speaking",
        model: MODEL_PRO,
        usage: result.usageMetadata,
        success: false,
        context: { part_number: partNumber, topic: topicName },
      });
      return null;
    }

    const parsed = JSON.parse(content);

    await logAIUsage({
      userId: userId ?? null,
      module: "speaking",
      model: MODEL_PRO,
      usage: result.usageMetadata,
      audioSeconds: Number(parsed.duration_estimate_seconds) || undefined,
      success: true,
      context: { part_number: partNumber, topic: topicName },
    });

    let fluencyScore = Number(parsed.criterion_scores?.fluency_and_coherence) || 0;
    let lexicalScore = Number(parsed.criterion_scores?.lexical_resource) || 0;
    let grammarScore = Number(parsed.criterion_scores?.grammatical_range_and_accuracy) || 0;
    let pronunciationScore = Number(parsed.criterion_scores?.pronunciation) || 0;

    const transcript: string = parsed.transcript || "";
    const transcriptWords = transcript
      .replace(/\([^)]*\)/g, "") // strip parenthetical notes like "(no audible response)"
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const durationSec = Number(parsed.duration_estimate_seconds) || 0;

    // Minimum content thresholds — below these, there is not enough testable language
    // to demonstrate features required for higher bands. Cap all criteria at Band 4.
    const minWords = partNumber === 2 ? 50 : 20;
    const minSeconds = partNumber === 2 ? 45 : 15;
    const insufficientContent =
      transcriptWords < minWords || (durationSec > 0 && durationSec < minSeconds);

    const applyCap = (
      cap: number,
      key: "fluency_and_coherence" | "lexical_resource" | "grammatical_range_and_accuracy" | "pronunciation",
      note: string
    ) => {
      const current = {
        fluency_and_coherence: fluencyScore,
        lexical_resource: lexicalScore,
        grammatical_range_and_accuracy: grammarScore,
        pronunciation: pronunciationScore,
      }[key];
      if (current <= cap) return;
      const newVal = cap;
      if (key === "fluency_and_coherence") fluencyScore = newVal;
      if (key === "lexical_resource") lexicalScore = newVal;
      if (key === "grammatical_range_and_accuracy") grammarScore = newVal;
      if (key === "pronunciation") pronunciationScore = newVal;
      if (parsed.criterion_feedback?.[key]) {
        parsed.criterion_feedback[key].band = newVal;
        parsed.criterion_feedback[key].feedback = [
          note,
          ...(parsed.criterion_feedback[key].feedback || []).slice(0, 1),
        ];
      }
    };

    // Enforce caps in code based on flags from the model.
    if (parsed.on_topic === false) {
      // Off-topic responses cannot demonstrate any criterion at higher bands —
      // there is no relevant language to grade. Cap all four at Band 3.
      const note =
        "Response did not address the question. With no on-topic language to assess, all criteria are capped at Band 3.";
      applyCap(3, "fluency_and_coherence", note);
      applyCap(3, "lexical_resource", note);
      applyCap(3, "grammatical_range_and_accuracy", note);
      applyCap(3, "pronunciation", note);
    } else if (insufficientContent) {
      // On-topic but too short to demonstrate Band 5+ features.
      const note = `Response is too short (${transcriptWords} words${
        durationSec ? `, ~${durationSec}s` : ""
      }) to demonstrate the features required for higher bands. All criteria capped at Band 4.`;
      applyCap(4, "fluency_and_coherence", note);
      applyCap(4, "lexical_resource", note);
      applyCap(4, "grammatical_range_and_accuracy", note);
      applyCap(4, "pronunciation", note);
    }

    if (parsed.sounds_memorised === true) {
      applyCap(
        5,
        "lexical_resource",
        "Response sounds memorised/rehearsed — Lexical Resource capped at Band 5."
      );
    }

    parsed.transcript_word_count = transcriptWords;

    // Recompute overall band from (possibly capped) criterion scores.
    const overallBandScore = roundToNearestHalf(
      (fluencyScore + lexicalScore + grammarScore + pronunciationScore) / 4
    );

    parsed.criterion_scores = {
      fluency_and_coherence: fluencyScore,
      lexical_resource: lexicalScore,
      grammatical_range_and_accuracy: grammarScore,
      pronunciation: pronunciationScore,
    };
    parsed.overall_band = overallBandScore;

    return {
      transcript: parsed.transcript || "",
      fluencyScore,
      lexicalScore,
      grammarScore,
      pronunciationScore,
      overallBandScore,
      feedback: parsed,
    };
  } catch (error) {
    console.error("Speaking evaluation failed:", error);
    await logAIUsage({
      userId: userId ?? null,
      module: "speaking",
      model: MODEL_PRO,
      usage: undefined,
      success: false,
      context: { part_number: partNumber, topic: topicName, error: String(error) },
    });
    return null;
  }
}
