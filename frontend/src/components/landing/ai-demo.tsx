import { Sparkles, AlertTriangle, CheckCircle2, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const corrections = [
  {
    type: "improvement" as const,
    original: "The graph shows that the number of people who used the internet increased dramatically.",
    suggestion: "The graph illustrates a dramatic increase in internet usage.",
    reason: "Use more varied vocabulary and concise phrasing for higher Lexical Resource score.",
  },
  {
    type: "error" as const,
    original: "In 2010, there was approximately 2 billion users.",
    suggestion: "In 2010, there were approximately 2 billion users.",
    reason: "Subject-verb agreement: 'users' is plural, requiring 'were' instead of 'was'.",
  },
  {
    type: "tip" as const,
    original: "The data shows an upward trend.",
    suggestion: "The data reveals a consistent upward trajectory, climbing steadily from 2005 onwards.",
    reason: "Add more detail and sophisticated vocabulary to boost your Task Achievement score.",
  },
]

const bandBreakdown = [
  { label: "Task Achievement", score: 7.0, color: "oklch(0.52 0.22 25)" },
  { label: "Coherence & Cohesion", score: 6.5, color: "oklch(0.40 0.15 25)" },
  { label: "Lexical Resource", score: 7.0, color: "oklch(0.52 0.22 25)" },
  { label: "Grammar Range", score: 6.0, color: "oklch(0.35 0.08 0)" },
]

export function AiDemo() {
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            AI Feedback Preview
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            See what our AI feedback looks like
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Detailed, actionable feedback on every submission — just like a real examiner
          </p>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-5">
          {/* Left: Writing corrections */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            {corrections.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  {c.type === "error" ? (
                    <Badge variant="outline" className="gap-1 border-destructive/30 text-destructive">
                      <AlertTriangle className="size-3" />
                      Grammar Fix
                    </Badge>
                  ) : c.type === "improvement" ? (
                    <Badge variant="outline" className="gap-1 border-accent/30 text-accent">
                      <ArrowUpRight className="size-3" />
                      Improvement
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 border-foreground/30 text-foreground">
                      <Sparkles className="size-3" />
                      Pro Tip
                    </Badge>
                  )}
                </div>

                <div className="mb-3 rounded-lg bg-destructive/5 px-4 py-2.5 text-sm leading-relaxed text-muted-foreground line-through decoration-destructive/40">
                  {c.original}
                </div>
                <div className="mb-3 rounded-lg bg-accent/5 px-4 py-2.5 text-sm leading-relaxed text-foreground">
                  <CheckCircle2 className="mb-0.5 mr-1.5 inline size-3.5 text-accent" />
                  {c.suggestion}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {c.reason}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Band score breakdown */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Writing Task 1
            </h4>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-bold text-accent">6.5</span>
              <span className="mb-1 text-sm text-muted-foreground">/ 9.0 band score</span>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {bandBreakdown.map((b) => (
                <div key={b.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-semibold text-foreground">{b.score}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(b.score / 9) * 100}%`, backgroundColor: b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-secondary p-4">
              <h5 className="text-sm font-semibold text-foreground">Key Recommendations</h5>
              <ul className="mt-2 flex flex-col gap-1.5">
                <li className="text-xs leading-relaxed text-muted-foreground">
                  - Vary sentence structures for better Grammar Range
                </li>
                <li className="text-xs leading-relaxed text-muted-foreground">
                  - Use more precise academic vocabulary
                </li>
                <li className="text-xs leading-relaxed text-muted-foreground">
                  - Improve paragraph transitions for Coherence
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
