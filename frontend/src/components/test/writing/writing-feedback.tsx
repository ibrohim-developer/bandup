"use client";

import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CriterionFeedback {
  band: number;
  feedback: string[];
  evidence_quotes: string[];
}

interface GrammarCorrection {
  original: string;
  corrected: string;
  issue: string;
  explanation: string;
}

interface VocabularyImprovement {
  original: string;
  better: string;
  reason: string;
}

interface CohesionImprovement {
  problem: string;
  fix: string;
}

interface ParsedFeedback {
  summary?: {
    strengths?: string[];
    weaknesses?: string[];
  };
  criterion_feedback?: {
    task_achievement_or_response?: CriterionFeedback;
    coherence_and_cohesion?: CriterionFeedback;
    lexical_resource?: CriterionFeedback;
    grammatical_range_and_accuracy?: CriterionFeedback;
  };
  grammar_corrections?: GrammarCorrection[];
  vocabulary_improvements?: VocabularyImprovement[];
  cohesion_improvements?: CohesionImprovement[];
  vocabulary_complexity?: {
    cefr_level?: string;
    label?: string;
    advice?: string;
  };
  vocabulary_repetition?: {
    has_repetition?: boolean;
    message?: string;
  };
  grammar_mistakes_count?: number;
  task_specific_notes?: string[];
  top_5_actions?: string[];
}

interface WritingFeedbackProps {
  feedback: string;
  overallBandScore?: number | null;
  taskAchievementScore?: number | null;
  coherenceScore?: number | null;
  lexicalScore?: number | null;
  grammarScore?: number | null;
}

function getScoreColor(score: number | null | undefined) {
  if (score == null) return "text-muted-foreground";
  if (score >= 7) return "text-green-600";
  if (score >= 5) return "text-amber-600";
  return "text-red-600";
}

function CollapsibleSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (count === 0) return null;

  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
            {count}
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {open && <div className="px-4 pb-4 space-y-2">{children}</div>}
    </div>
  );
}

export function WritingFeedback({
  feedback,
  overallBandScore,
  taskAchievementScore,
  coherenceScore,
  lexicalScore,
  grammarScore,
}: WritingFeedbackProps) {
  const parsed = useMemo<ParsedFeedback | null>(() => {
    try {
      return JSON.parse(feedback);
    } catch {
      return null;
    }
  }, [feedback]);

  if (!parsed) {
    return <p className="text-sm whitespace-pre-line">{feedback}</p>;
  }

  const criteria: {
    key: string;
    label: string;
    score: number | null | undefined;
  }[] = [
    {
      key: "task_achievement_or_response",
      label: "Task Response",
      score:
        taskAchievementScore ??
        parsed.criterion_feedback?.task_achievement_or_response?.band,
    },
    {
      key: "coherence_and_cohesion",
      label: "Coherence & Cohesion",
      score:
        coherenceScore ??
        parsed.criterion_feedback?.coherence_and_cohesion?.band,
    },
    {
      key: "lexical_resource",
      label: "Lexical Resource",
      score: lexicalScore ?? parsed.criterion_feedback?.lexical_resource?.band,
    },
    {
      key: "grammatical_range_and_accuracy",
      label: "Grammatical Range & Accuracy",
      score:
        grammarScore ??
        parsed.criterion_feedback?.grammatical_range_and_accuracy?.band,
    },
  ];

  const grammarMistakesCount =
    parsed.grammar_mistakes_count ?? parsed.grammar_corrections?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Overall Band Score */}
      {overallBandScore != null && (
        <div className="text-center py-6">
          <h3 className="text-lg font-bold mb-2">Overall Band Score</h3>
          <p
            className={`text-5xl md:text-6xl font-bold ${getScoreColor(overallBandScore)}`}
          >
            {overallBandScore}
          </p>
          <p className="text-sm text-muted-foreground mt-1">(+/- 0.5)</p>
        </div>
      )}

      {/* Stat Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {/* Vocabulary Complexity */}
        {parsed.vocabulary_complexity && (
          <div className="flex flex-col items-center rounded-xl bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-green-700 dark:text-green-400 mb-2 text-center">
              Vocabulary
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-300">
              {parsed.vocabulary_complexity.cefr_level}
            </p>
            {parsed.vocabulary_complexity.label && (
              <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-400 mt-1">
                {parsed.vocabulary_complexity.label}
              </p>
            )}
          </div>
        )}

        {/* Grammar Mistakes */}
        <div className="flex flex-col items-center rounded-xl bg-yellow-100 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-yellow-700 dark:text-yellow-400 mb-2 text-center">
            Grammar
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-800 dark:text-yellow-300">
            {grammarMistakesCount}
          </p>
        </div>

        {/* Vocabulary Repetition */}
        {parsed.vocabulary_repetition && (
          <div className="flex flex-col items-center rounded-xl bg-purple-100 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-purple-700 dark:text-purple-400 mb-2 text-center">
              Repetition
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-800 dark:text-purple-300">
              {parsed.vocabulary_repetition.has_repetition ? "Found" : "None"}
            </p>
            {parsed.vocabulary_repetition.message && (
              <p className="text-[10px] sm:text-xs text-purple-700 dark:text-purple-400 mt-2 text-center line-clamp-2">
                {parsed.vocabulary_repetition.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Criterion Sections */}
      {parsed.criterion_feedback && (
        <div className="space-y-0 divide-y divide-border">
          {criteria.map(({ key, label, score }) => {
            const cf =
              parsed.criterion_feedback?.[
                key as keyof typeof parsed.criterion_feedback
              ];
            if (!cf) return null;
            return (
              <div key={key} className="py-6">
                <h4 className="text-lg font-bold text-center">{label}</h4>
                <p
                  className={`text-3xl font-bold text-center mt-1 ${getScoreColor(score)}`}
                >
                  {score ?? cf.band}
                </p>
                {cf.feedback && cf.feedback.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {cf.feedback.map((f, i) => (
                      <p
                        key={i}
                        className="text-sm text-muted-foreground text-center max-w-5xl mx-auto"
                      >
                        {f}
                      </p>
                    ))}
                  </div>
                )}
                {/* {cf.evidence_quotes && cf.evidence_quotes.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {cf.evidence_quotes.map((q, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded bg-muted italic"
                      >
                        &ldquo;{q}&rdquo;
                      </span>
                    ))}
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
      )}

      <Separator />

      {/* Collapsible Detail Sections */}
      <div className="space-y-3">
        {/* Strengths & Weaknesses */}
        {parsed.summary &&
        (parsed.summary.strengths?.length ||
          parsed.summary.weaknesses?.length) ? (
          <CollapsibleSection
            title="Strengths & Weaknesses"
            count={
              (parsed.summary.strengths?.length ?? 0) +
              (parsed.summary.weaknesses?.length ?? 0)
            }
          >
            <div className="grid md:grid-cols-2 gap-3">
              {parsed.summary.strengths &&
                parsed.summary.strengths.length > 0 && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <h5 className="font-medium text-green-700 dark:text-green-400 mb-2 text-sm">
                      Strengths
                    </h5>
                    <ul className="space-y-1">
                      {parsed.summary.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-green-500 shrink-0">+</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {parsed.summary.weaknesses &&
                parsed.summary.weaknesses.length > 0 && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <h5 className="font-medium text-red-700 dark:text-red-400 mb-2 text-sm">
                      Areas to Improve
                    </h5>
                    <ul className="space-y-1">
                      {parsed.summary.weaknesses.map((w, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-red-500 shrink-0">-</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </CollapsibleSection>
        ) : null}

        {/* Grammar Corrections */}
        <CollapsibleSection
          title="Grammar Corrections"
          count={parsed.grammar_corrections?.length ?? 0}
        >
          {parsed.grammar_corrections?.map((gc, i) => (
            <div key={i} className="p-2 rounded border text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="line-through text-red-500">{gc.original}</span>
                <span className="text-muted-foreground">&rarr;</span>
                <span className="text-green-600 font-medium">
                  {gc.corrected}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {gc.issue}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">{gc.explanation}</p>
            </div>
          ))}
        </CollapsibleSection>

        {/* Vocabulary Improvements */}
        <CollapsibleSection
          title="Vocabulary Improvements"
          count={parsed.vocabulary_improvements?.length ?? 0}
        >
          {parsed.vocabulary_improvements?.map((vi, i) => (
            <div key={i} className="p-2 rounded border text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">{vi.original}</span>
                <span className="text-muted-foreground">&rarr;</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  {vi.better}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">{vi.reason}</p>
            </div>
          ))}
        </CollapsibleSection>

        {/* Cohesion Improvements */}
        <CollapsibleSection
          title="Cohesion Improvements"
          count={parsed.cohesion_improvements?.length ?? 0}
        >
          {parsed.cohesion_improvements?.map((ci, i) => (
            <div key={i} className="p-2 rounded border text-xs">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Issue:</span>{" "}
                {ci.problem}
              </p>
              <p className="text-muted-foreground mt-1">
                <span className="font-medium text-foreground">Fix:</span>{" "}
                {ci.fix}
              </p>
            </div>
          ))}
        </CollapsibleSection>

        {/* Top 5 Actions */}
        {parsed.top_5_actions && parsed.top_5_actions.length > 0 && (
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <h5 className="font-medium text-blue-700 dark:text-blue-400 mb-2 text-sm">
              Top Actions to Improve
            </h5>
            <ol className="list-decimal list-inside space-y-1">
              {parsed.top_5_actions.map((action, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {action}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
