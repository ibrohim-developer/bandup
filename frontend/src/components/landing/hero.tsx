import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Mic, PenLine, BookOpen, Headphones, Sparkles, TrendingUp, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-accent/5" />
        <div className="absolute -bottom-20 -left-20 size-[400px] rounded-full bg-foreground/5" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col items-center text-center">
          {/* Tag */}
          <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-accent" />
            AI-Powered IELTS Preparation
          </Badge>

          {/* Headline */}
          <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl md:leading-tight lg:text-7xl lg:leading-tight">
            The <span className="text-accent">Free</span> Way to Ace Your IELTS
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Practice all 4 IELTS modules with instant AI feedback. Get your estimated band score in minutes, not days.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30 transition-all">
              <Link href="/dashboard/reading">
                Start Free Mock Exam
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base font-medium" asChild>
              <Link href="#how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <TrustBadge icon={<Users className="size-4 text-accent" />} text="Free, no credit card" />
            <TrustBadge icon={<Sparkles className="size-4 text-accent" />} text="AI-powered feedback" />
            <TrustBadge icon={<TrendingUp className="size-4 text-accent" />} text="All 4 IELTS modules" />
          </div>

          {/* Floating module cards preview */}
          <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            <ModuleCard icon={<Mic className="size-5" />} label="Speaking" color="bg-accent/10 text-accent" />
            <ModuleCard icon={<PenLine className="size-5" />} label="Writing" color="bg-accent/10 text-accent" />
            <ModuleCard icon={<BookOpen className="size-5" />} label="Reading" color="bg-accent/10 text-accent" />
            <ModuleCard icon={<Headphones className="size-5" />} label="Listening" color="bg-accent/10 text-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      <span>{text}</span>
    </div>
  )
}

function ModuleCard({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
  )
}
