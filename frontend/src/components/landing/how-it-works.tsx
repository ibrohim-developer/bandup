import { MousePointerClick, ClipboardEdit, Sparkles, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: MousePointerClick,
    step: "01",
    title: "Choose your module",
    description: "Pick Speaking, Writing, Reading, Listening, or take a Full Mock Exam.",
  },
  {
    icon: ClipboardEdit,
    step: "02",
    title: "Practice",
    description: "Complete tasks in a realistic exam environment with real-time guidance.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get AI Feedback",
    description: "Receive instant, detailed evaluation with estimated band scores.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Track & Improve",
    description: "Monitor progress over time and focus on your weak areas.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            How It Works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Four simple steps to a higher band score
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Get started in under a minute and see results immediately
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connector line (desktop) */}
          <div className="absolute top-12 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] hidden h-px bg-border lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="group relative flex flex-col items-center text-center">
                <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border-2 border-border bg-card shadow-sm transition-all group-hover:border-accent group-hover:shadow-md">
                  <s.icon className="size-6 text-accent" />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-widest text-accent">
                  Step {s.step}
                </span>
                <h3 className="mt-2 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
