'use client'

import { useMemo } from 'react'

interface CriterionFeedback {
  band: number
  feedback: string[]
  evidence_quotes: string[]
}

interface GrammarCorrection {
  original: string
  corrected: string
  issue: string
  explanation: string
}

interface VocabularyImprovement {
  original: string
  better: string
  reason: string
}

interface CohesionImprovement {
  problem: string
  fix: string
}

interface ParsedFeedback {
  summary?: {
    strengths?: string[]
    weaknesses?: string[]
  }
  criterion_feedback?: {
    task_achievement_or_response?: CriterionFeedback
    coherence_and_cohesion?: CriterionFeedback
    lexical_resource?: CriterionFeedback
    grammatical_range_and_accuracy?: CriterionFeedback
  }
  grammar_corrections?: GrammarCorrection[]
  vocabulary_improvements?: VocabularyImprovement[]
  cohesion_improvements?: CohesionImprovement[]
  task_specific_notes?: string[]
  top_5_actions?: string[]
}

export function WritingFeedback({ feedback }: { feedback: string }) {
  const parsed = useMemo<ParsedFeedback | null>(() => {
    try {
      return JSON.parse(feedback)
    } catch {
      return null
    }
  }, [feedback])

  // Fallback: if it's not valid JSON, show as plain text
  if (!parsed) {
    return <p className="text-sm whitespace-pre-line">{feedback}</p>
  }

  return (
    <div className="space-y-5 text-sm">
      {/* Strengths & Weaknesses */}
      {parsed.summary && (
        <div className="grid md:grid-cols-2 gap-4">
          {parsed.summary.strengths && parsed.summary.strengths.length > 0 && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <h5 className="font-medium text-green-700 dark:text-green-400 mb-2">Strengths</h5>
              <ul className="space-y-1">
                {parsed.summary.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-500 shrink-0">+</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {parsed.summary.weaknesses && parsed.summary.weaknesses.length > 0 && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <h5 className="font-medium text-red-700 dark:text-red-400 mb-2">Areas to Improve</h5>
              <ul className="space-y-1">
                {parsed.summary.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-500 shrink-0">-</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Criterion Feedback */}
      {parsed.criterion_feedback && (
        <div className="space-y-3">
          <h5 className="font-medium">Detailed Criterion Feedback</h5>
          {Object.entries(parsed.criterion_feedback).map(([key, cf]) => {
            if (!cf) return null
            const label = key
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase())
              .replace('Or', '/')
            return (
              <div key={key} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{label}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    Band {cf.band}
                  </span>
                </div>
                {cf.feedback?.map((f, i) => (
                  <p key={i} className="text-muted-foreground mt-1">{f}</p>
                ))}
                {cf.evidence_quotes && cf.evidence_quotes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cf.evidence_quotes.map((q, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-muted italic">
                        &ldquo;{q}&rdquo;
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Grammar Corrections */}
      {parsed.grammar_corrections && parsed.grammar_corrections.length > 0 && (
        <div>
          <h5 className="font-medium mb-2">Grammar Corrections</h5>
          <div className="space-y-2">
            {parsed.grammar_corrections.map((gc, i) => (
              <div key={i} className="p-2 rounded border text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="line-through text-red-500">{gc.original}</span>
                  <span className="text-muted-foreground">&rarr;</span>
                  <span className="text-green-600 font-medium">{gc.corrected}</span>
                  <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{gc.issue}</span>
                </div>
                <p className="text-muted-foreground mt-1">{gc.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary Improvements */}
      {parsed.vocabulary_improvements && parsed.vocabulary_improvements.length > 0 && (
        <div>
          <h5 className="font-medium mb-2">Vocabulary Improvements</h5>
          <div className="space-y-2">
            {parsed.vocabulary_improvements.map((vi, i) => (
              <div key={i} className="p-2 rounded border text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">{vi.original}</span>
                  <span className="text-muted-foreground">&rarr;</span>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">{vi.better}</span>
                </div>
                <p className="text-muted-foreground mt-1">{vi.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cohesion Improvements */}
      {parsed.cohesion_improvements && parsed.cohesion_improvements.length > 0 && (
        <div>
          <h5 className="font-medium mb-2">Cohesion Improvements</h5>
          <div className="space-y-2">
            {parsed.cohesion_improvements.map((ci, i) => (
              <div key={i} className="p-2 rounded border text-xs">
                <p className="text-muted-foreground"><span className="font-medium text-foreground">Issue:</span> {ci.problem}</p>
                <p className="text-muted-foreground mt-1"><span className="font-medium text-foreground">Fix:</span> {ci.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 5 Actions */}
      {parsed.top_5_actions && parsed.top_5_actions.length > 0 && (
        <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <h5 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Top Actions to Improve</h5>
          <ol className="list-decimal list-inside space-y-1">
            {parsed.top_5_actions.map((action, i) => (
              <li key={i} className="text-muted-foreground">{action}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
