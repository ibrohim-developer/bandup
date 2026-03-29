"use client"

import { TrendingUp, Target, AlertTriangle, CheckCircle2 } from "lucide-react"

const moduleScores = [
  { label: "Listening", score: 7.0, trend: "+0.5" },
  { label: "Reading", score: 7.5, trend: "+1.0" },
  { label: "Writing", score: 6.5, trend: "+0.5" },
  { label: "Speaking", score: 6.5, trend: "+1.0" },
]

const weeklyProgress = [
  { week: "W1", score: 5.5 },
  { week: "W2", score: 5.5 },
  { week: "W3", score: 6.0 },
  { week: "W4", score: 6.0 },
  { week: "W5", score: 6.5 },
  { week: "W6", score: 6.5 },
  { week: "W7", score: 7.0 },
  { week: "W8", score: 7.0 },
]

export function DashboardPreview() {
  const maxScore = 9
  const overallScore = 7.0

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Your Dashboard
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Track your progress in real-time
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            A comprehensive dashboard to monitor improvement across all modules
          </p>
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
          {/* Top row: Overall score + module breakdown */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Overall score */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-foreground p-6 text-background">
              <p className="text-sm font-medium opacity-80">Overall Band Score</p>
              <span className="mt-2 text-6xl font-bold">{overallScore}</span>
              <div className="mt-3 flex items-center gap-1.5 text-sm font-medium">
                <TrendingUp className="size-4" />
                <span>+1.5 from first test</span>
              </div>
            </div>

            {/* Module scores */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Module Breakdown
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {moduleScores.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">{m.label}</p>
                      <p className="text-2xl font-bold text-foreground">{m.score}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                      <TrendingUp className="size-3" />
                      {m.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row: Progress graph + strengths */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Progress chart */}
            <div className="rounded-xl border border-border bg-background p-5 lg:col-span-2">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Score Progress Over Time
              </h4>
              <div className="flex h-40 items-end gap-3">
                {weeklyProgress.map((w) => (
                  <div key={w.week} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-xs font-medium text-foreground">{w.score}</span>
                    <div
                      className="w-full rounded-t-md bg-accent/80 transition-all hover:bg-accent"
                      style={{ height: `${(w.score / maxScore) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{w.week}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & weaknesses */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Key Insights
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Reading improved most</p>
                    <p className="text-xs text-muted-foreground">+1.0 band in 8 weeks</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Speaking on track</p>
                    <p className="text-xs text-muted-foreground">Consistent improvement trend</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Target className="mt-0.5 size-4 shrink-0 text-chart-5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Target: Band 7.5</p>
                    <p className="text-xs text-muted-foreground">Estimated 3 weeks away</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Focus on Writing</p>
                    <p className="text-xs text-muted-foreground">Grammar range needs work</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
