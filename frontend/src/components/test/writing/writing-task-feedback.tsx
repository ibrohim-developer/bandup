"use client";

import { useState } from "react";
import {
  ChevronDown,
  ThumbsUp,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";

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

interface CriterionFeedback {
  band: number;
  feedback: string[];
  evidence_quotes: string[];
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
  task_specific_notes?: string[];
}

export interface WritingTaskItem {
  taskNumber: number;
  taskType: string;
  content: string;
  wordCount: number;
  overallBandScore: number | null;
  taskAchievementScore: number | null;
  coherenceScore: number | null;
  lexicalScore: number | null;
  grammarScore: number | null;
  parsedFeedback: ParsedFeedback | null;
}

const feedbackColors = {
  strength: "border-l-4 border-l-green-500 bg-green-500/5",
  improvement: "border-l-4 border-l-yellow-500 bg-yellow-500/5",
};

export function WritingTaskFeedback({ tasks }: { tasks: WritingTaskItem[] }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isExpanded = expandedIdx === task.taskNumber;
        const hasScores = task.overallBandScore !== null;

        return (
          <Card key={task.taskNumber}>
            <button
              onClick={() => setExpandedIdx(isExpanded ? null : task.taskNumber)}
              className="w-full px-6 py-4 text-left transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Task {task.taskNumber}
                  </h3>
                  <p className="text-base font-medium">
                    {task.taskType === "report" ? "Report Writing" : "Essay Writing"}
                  </p>
                  {hasScores && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {task.wordCount} words · Band:{" "}
                      <span className="font-semibold text-primary">
                        {task.overallBandScore}/9
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
                {/* Essay content */}
                {task.content && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Your Essay
                    </h4>
                    <div className="p-4 rounded-lg bg-muted/50 border text-sm leading-relaxed max-h-48 overflow-y-auto">
                      {task.content}
                    </div>
                  </div>
                )}

                {!hasScores && (
                  <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-sm text-amber-700 dark:text-amber-400">
                    Evaluation pending — scores are not yet available for this task.
                  </div>
                )}

                {hasScores && task.parsedFeedback && (
                  <>
                    {/* Criterion scores mini grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(
                        [
                          ["Task Achievement", task.taskAchievementScore],
                          ["Coherence", task.coherenceScore],
                          ["Lexical", task.lexicalScore],
                          ["Grammar", task.grammarScore],
                        ] as [string, number | null][]
                      ).map(([label, val]) => (
                        <div key={label} className="text-center p-3 rounded-lg bg-muted">
                          <div
                            className={`text-xl font-bold ${
                              val !== null && val >= 7
                                ? "text-green-600"
                                : val !== null && val >= 5
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {val !== null ? val : "-"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Strengths & Weaknesses */}
                    {task.parsedFeedback.summary && (
                      <div className="space-y-3">
                        {task.parsedFeedback.summary.strengths?.map((s, i) => (
                          <div key={`s-${i}`} className={`flex gap-3 rounded-lg p-3 ${feedbackColors.strength}`}>
                            <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-sm">{s}</p>
                          </div>
                        ))}
                        {task.parsedFeedback.summary.weaknesses?.map((w, i) => (
                          <div key={`w-${i}`} className={`flex gap-3 rounded-lg p-3 ${feedbackColors.improvement}`}>
                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <p className="text-sm">{w}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Criterion feedback with evidence quotes */}
                    {task.parsedFeedback.criterion_feedback && (
                      <div className="space-y-4">
                        {Object.entries(task.parsedFeedback.criterion_feedback).map(([key, cf]) => {
                          if (!cf?.feedback?.length) return null;
                          const label = key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase());
                          return (
                            <div key={key}>
                              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                {label} — Band {cf.band}
                              </h5>
                              {cf.feedback.map((f, i) => (
                                <p key={i} className="text-sm text-muted-foreground mb-1">{f}</p>
                              ))}
                              {cf.evidence_quotes?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {cf.evidence_quotes.map((q, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded italic"
                                    >
                                      &ldquo;{q}&rdquo;
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Grammar corrections */}
                    {task.parsedFeedback.grammar_corrections &&
                      task.parsedFeedback.grammar_corrections.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Grammar Corrections
                          </h4>
                          <div className="space-y-2">
                            {task.parsedFeedback.grammar_corrections.map((gc, i) => (
                              <div key={i} className="p-3 rounded-lg border text-sm space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="line-through text-red-500/70">{gc.original}</span>
                                  <span className="text-muted-foreground">→</span>
                                  <span className="text-green-600 dark:text-green-400 font-medium">{gc.corrected}</span>
                                  {gc.issue && (
                                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                                      {gc.issue}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{gc.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Vocabulary improvements */}
                    {task.parsedFeedback.vocabulary_improvements &&
                      task.parsedFeedback.vocabulary_improvements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Vocabulary Improvements
                          </h4>
                          <div className="space-y-2">
                            {task.parsedFeedback.vocabulary_improvements.map((vi, i) => (
                              <div key={i} className="p-3 rounded-lg border text-sm space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-muted-foreground">{vi.original}</span>
                                  <span className="text-muted-foreground">→</span>
                                  <span className="text-primary font-medium">{vi.better}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{vi.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Cohesion improvements */}
                    {task.parsedFeedback.cohesion_improvements &&
                      task.parsedFeedback.cohesion_improvements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Cohesion Improvements
                          </h4>
                          <div className="space-y-2">
                            {task.parsedFeedback.cohesion_improvements.map((ci, i) => (
                              <div key={i} className="p-3 rounded-lg border text-sm space-y-1">
                                <p className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Issue:</span> {ci.problem}
                                </p>
                                <p className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Fix:</span> {ci.fix}
                                </p>
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
