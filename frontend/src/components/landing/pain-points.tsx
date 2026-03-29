import { DollarSign, MicOff, Clock, HelpCircle, ArrowRight } from "lucide-react"

const painPoints = [
  {
    icon: DollarSign,
    title: "Expensive tutors & prep courses",
    description: "Traditional IELTS preparation can cost hundreds of dollars for limited sessions.",
  },
  {
    icon: MicOff,
    title: "No way to practice speaking at home",
    description: "Without a partner, practicing your speaking skills feels impossible.",
  },
  {
    icon: Clock,
    title: "Waiting days for writing feedback",
    description: "Submit an essay and wait 3-5 days for a teacher to grade it. Too slow.",
  },
  {
    icon: HelpCircle,
    title: "Not knowing your real band score",
    description: "Going into exam day without a reliable estimate of where you stand.",
  },
]

export function PainPoints() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            The Problem
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            IELTS prep shouldn{"'"}t be this hard
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Most test-takers face the same frustrating challenges
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-destructive/10">
                <point.icon className="size-5 text-destructive" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-lg font-semibold text-foreground">
          <span>BandUp solves all of this</span>
          <ArrowRight className="size-5 text-accent" />
        </div>
      </div>
    </section>
  )
}
