'use client'

import { ArrowRight, TrendingUp, Users, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ForBusinessesHero() {
  const scrollToForm = () => {
    const element = document.getElementById('application-form')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-12 md:pt-40 md:pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8 items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5">
              <div className="size-2 rounded-full bg-accent" />
              <span className="text-sm font-medium text-accent">For Learning Centers & Test Centres</span>
            </div>

            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Empower Your Students with <span className="text-accent">AI-Powered IELTS Prep</span>
            </h1>

            <p className="mb-8 text-balance text-lg text-muted-foreground leading-relaxed">
              Offer BandUp to your students and transform how you deliver IELTS preparation. Get instant AI feedback, detailed analytics, and increase student success rates with a modern platform built for IELTS centers.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={scrollToForm}
                className="h-11 gap-2 rounded-full bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Start Your Application
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full border-border px-6 text-foreground hover:bg-secondary hover:text-foreground"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          <DashboardMockup />
        </div>

        {/*
        <div className="mt-16 grid gap-8 border-t border-border pt-12 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-3 text-3xl font-bold text-accent">500+</div>
            <p className="text-sm text-muted-foreground">Learning Centers Partner</p>
          </div>
          <div className="text-center">
            <div className="mb-3 text-3xl font-bold text-accent">50K+</div>
            <p className="text-sm text-muted-foreground">Students Trained</p>
          </div>
          <div className="text-center">
            <div className="mb-3 text-3xl font-bold text-accent">8.5</div>
            <p className="text-sm text-muted-foreground">Avg. Band Improvement</p>
          </div>
        </div>
        */}
      </div>
    </section>
  )
}

function DashboardMockup() {
  const bars = [4.2, 5.1, 4.8, 6.0, 5.7, 6.8, 7.2, 6.9, 7.6, 8.1, 7.8, 8.4]
  const max = 9
  const points = bars
    .map((v, i) => `${(i / (bars.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(' ')

  return (
    <div className="relative rounded-2xl border border-border bg-card p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Center Performance</p>
          <p className="text-lg font-bold text-foreground">Last 12 weeks</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          <TrendingUp className="size-3" />
          +24%
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-secondary/60 p-2.5">
          <Users className="size-3.5 text-muted-foreground" />
          <p className="mt-1 text-base font-bold text-foreground">1,284</p>
          <p className="text-[10px] text-muted-foreground">Students</p>
        </div>
        <div className="rounded-lg bg-secondary/60 p-2.5">
          <Target className="size-3.5 text-muted-foreground" />
          <p className="mt-1 text-base font-bold text-foreground">7.2</p>
          <p className="text-[10px] text-muted-foreground">Avg Band</p>
        </div>
        <div className="rounded-lg bg-secondary/60 p-2.5">
          <TrendingUp className="size-3.5 text-muted-foreground" />
          <p className="mt-1 text-base font-bold text-foreground">+1.4</p>
          <p className="text-[10px] text-muted-foreground">Growth</p>
        </div>
      </div>

      {/* Line chart */}
      <div className="mt-4 rounded-lg border border-border bg-background p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Avg Band Score Trend
        </p>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-24 w-full">
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" className="text-accent" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-accent" />
            </linearGradient>
          </defs>
          <polygon
            fill="url(#chartFill)"
            points={`0,100 ${points} 100,100`}
          />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="text-accent"
            points={points}
          />
        </svg>
      </div>

      {/* Bar chart */}
      <div className="mt-3 rounded-lg border border-border bg-background p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Module Breakdown
          </p>
          <span className="text-[10px] text-muted-foreground">/ 9</span>
        </div>
        <div className="flex h-16 items-end gap-2">
          {[
            { label: 'L', score: 7.5 },
            { label: 'R', score: 8.0 },
            { label: 'W', score: 6.5 },
            { label: 'S', score: 7.0 },
          ].map((m) => (
            <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm bg-accent/80"
                style={{ height: `${(m.score / 9) * 100}%` }}
              />
              <span className="text-[9px] font-medium text-muted-foreground">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
