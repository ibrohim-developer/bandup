import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic practice",
    features: [
      "2 practice sessions per day",
      "Basic AI feedback",
      "Reading & Listening modules",
      "Limited question bank",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "Everything you need to reach your target",
    features: [
      "Unlimited practice sessions",
      "Full AI feedback with band scores",
      "All 4 IELTS modules",
      "Full mock exams",
      "Progress tracking dashboard",
      "Complete question bank",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$24",
    period: "per month",
    description: "Maximum preparation with personal guidance",
    features: [
      "Everything in Pro",
      "Personalized study plan",
      "Priority AI processing",
      "Advanced analytics",
      "Priority support",
      "Exam date countdown planner",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Pricing
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Choose the plan that fits your preparation timeline
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 transition-all md:p-8",
                plan.highlighted
                  ? "border-accent bg-card shadow-xl shadow-accent/10 ring-1 ring-accent/20"
                  : "border-border bg-card hover:shadow-md"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                  Most Popular
                </Badge>
              )}

              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/ {plan.period}</span>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="size-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  "mt-8 w-full rounded-full font-semibold",
                  plan.highlighted
                    ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25"
                    : "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                <Link href="/dashboard/reading">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          We accept Payme, Click, Visa, and Mastercard. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
