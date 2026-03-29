"use client";

import { useState } from "react";
import {
  ChevronDown,
  ThumbsUp,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Quote,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

interface VocabularyImprovement {
  original: string;
  better: string;
  reason: string;
}

interface PronunciationNote {
  word: string;
  issue: string;
  suggestion: string;
}

interface CriterionFeedback {
  band: number;
  feedback: string[];
  evidence_quotes: string[];
}

interface SubmissionFeedback {
  questionIndex: number;
  questionText: string;
  transcript: string | null;
  overallBandScore: number | null;
  fluencyScore: number | null;
  lexicalScore: number | null;
  grammarScore: number | null;
  pronunciationScore: number | null;
  durationSeconds: number | null;
  feedback: {
    summary?: { strengths?: string[]; weaknesses?: string[] };
    criterion_feedback?: {
      fluency_and_coherence?: CriterionFeedback;
      lexical_resource?: CriterionFeedback;
      grammatical_range_and_accuracy?: CriterionFeedback;
      pronunciation?: CriterionFeedback;
    };
    grammar_corrections?: GrammarCorrection[];
    vocabulary_improvements?: VocabularyImprovement[];
    pronunciation_notes?: PronunciationNote[];
  } | null;
}

interface SpeakingQuestionFeedbackProps {
  submissions: SubmissionFeedback[];
  topicName: string;
  partNumber: number;
}

const feedbackIcons = {
  strength: <ThumbsUp className="h-4 w-4 text-green-500" />,
  improvement: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  tip: <Lightbulb className="h-4 w-4 text-primary" />,
};

const feedbackColors = {
  strength: "border-l-4 border-l-green-500 bg-green-500/5",
  improvement: "border-l-4 border-l-yellow-500 bg-yellow-500/5",
  tip: "border-l-4 border-l-primary bg-primary/5",
};

export function SpeakingQuestionFeedback({
  submissions,
  topicName,
  partNumber,
}: SpeakingQuestionFeedbackProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-black text-xs tracking-widest uppercase">
          Part {partNumber}
        </span>
        <span className="ml-3 text-sm text-muted-foreground font-medium">
          {topicName}
        </span>
      </div>

      {submissions.map((sub) => {
        const isExpanded = expandedIdx === sub.questionIndex;
        const hasScores = sub.overallBandScore !== null;

        return (
          <Card key={sub.questionIndex}>
            <button
              onClick={() =>
                setExpandedIdx(isExpanded ? null : sub.questionIndex)
              }
              className="w-full px-6 py-4 text-left transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Question {sub.questionIndex + 1}
                  </h3>
                  <p className="text-base font-medium truncate">
                    {sub.questionText}
                  </p>
                  {hasScores && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {sub.durationSeconds
                        ? `${Math.round(sub.durationSeconds)}s`
                        : ""}{" "}
                      · Score:{" "}
                      <span className="font-semibold text-primary">
                        {sub.overallBandScore}/9
                      </span>
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-border px-6 py-6 space-y-6">
                {/* Transcript */}
                {sub.transcript && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Your Response
                    </h4>
                    <div className="p-4 rounded-lg bg-muted/50 border text-sm leading-relaxed italic">
                      &ldquo;{sub.transcript}&rdquo;
                    </div>
                  </div>
                )}

                {!hasScores && (
                  <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-sm text-amber-700 dark:text-amber-400">
                    Evaluation pending — scores are not yet available for this
                    question.
                  </div>
                )}

                {hasScores && sub.feedback && (
                  <>
                    {/* Criterion scores mini grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        ["Fluency", sub.fluencyScore],
                        ["Lexical", sub.lexicalScore],
                        ["Grammar", sub.grammarScore],
                        ["Pronunciation", sub.pronunciationScore],
                      ].map(([label, val]) => (
                        <div
                          key={label as string}
                          className="text-center p-3 rounded-lg bg-muted"
                        >
                          <div
                            className={`text-xl font-bold ${
                              (val as number) >= 7
                                ? "text-green-600"
                                : (val as number) >= 5
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {val !== null ? val : "-"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {label as string}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Strengths & Weaknesses */}
                    {sub.feedback.summary && (
                      <div className="space-y-3">
                        {sub.feedback.summary.strengths?.map((s, i) => (
                          <div
                            key={`s-${i}`}
                            className={`flex gap-3 rounded-lg p-3 ${feedbackColors.strength}`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {feedbackIcons.strength}
                            </div>
                            <p className="text-sm">{s}</p>
                          </div>
                        ))}
                        {sub.feedback.summary.weaknesses?.map((w, i) => (
                          <div
                            key={`w-${i}`}
                            className={`flex gap-3 rounded-lg p-3 ${feedbackColors.improvement}`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {feedbackIcons.improvement}
                            </div>
                            <p className="text-sm">{w}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Criterion evidence quotes */}
                    {sub.feedback.criterion_feedback && (
                      <div className="space-y-4">
                        {Object.entries(sub.feedback.criterion_feedback).map(
                          ([key, cf]) => {
                            if (
                              !cf?.evidence_quotes?.length &&
                              !cf?.feedback?.length
                            )
                              return null;
                            const label = key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase());
                            return (
                              <div key={key}>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                  {label} — Band {cf.band}
                                </h5>
                                {cf.feedback?.map((f, i) => (
                                  <p
                                    key={i}
                                    className="text-sm text-muted-foreground mb-1"
                                  >
                                    {f}
                                  </p>
                                ))}
                                {cf.evidence_quotes?.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {cf.evidence_quotes.map((q, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                                      >
                                        <Quote className="h-3 w-3" />
                                        {q}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}

                    {/* Grammar corrections */}
                    {sub.feedback.grammar_corrections &&
                      sub.feedback.grammar_corrections.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Grammar Corrections
                          </h4>
                          <div className="space-y-2">
                            {sub.feedback.grammar_corrections.map((gc, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-lg border text-sm space-y-1"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="line-through text-red-500/70">
                                    {gc.original}
                                  </span>
                                  <span className="text-muted-foreground">
                                    →
                                  </span>
                                  <span className="text-green-600 dark:text-green-400 font-medium">
                                    {gc.corrected}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {gc.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Vocabulary improvements */}
                    {sub.feedback.vocabulary_improvements &&
                      sub.feedback.vocabulary_improvements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Vocabulary Improvements
                          </h4>
                          <div className="space-y-2">
                            {sub.feedback.vocabulary_improvements.map(
                              (vi, i) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-lg border text-sm space-y-1"
                                >
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-muted-foreground">
                                      {vi.original}
                                    </span>
                                    <span className="text-muted-foreground">
                                      →
                                    </span>
                                    <span className="text-primary font-medium">
                                      {vi.better}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {vi.reason}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Pronunciation notes */}
                    {sub.feedback.pronunciation_notes &&
                      sub.feedback.pronunciation_notes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Pronunciation Notes
                          </h4>
                          <div className="space-y-2">
                            {sub.feedback.pronunciation_notes.map((pn, i) => (
                              <div
                                key={i}
                                className={`flex gap-3 rounded-lg p-3 ${feedbackColors.tip}`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {feedbackIcons.tip}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">{pn.word}</span>
                                  {pn.issue && (
                                    <span className="text-muted-foreground">
                                      {" "}
                                      — {pn.issue}
                                    </span>
                                  )}
                                  {pn.suggestion && (
                                    <p className="text-muted-foreground mt-0.5">
                                      {pn.suggestion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
