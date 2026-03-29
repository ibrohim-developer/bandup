'use client'

import { ArrowRight } from 'lucide-react'
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
              Offer BandUp to your students and transform how you deliver IELTS preparation. Get instant AI feedback, detailed analytics, and increase student success rates with a proven platform trusted by thousands.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={scrollToForm}
                className="rounded-full bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent/90 h-11"
              >
                Start Your Application
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-border hover:bg-secondary h-11"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="relative h-96 rounded-2xl bg-primary/5 border border-border overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-5xl font-bold text-primary/20">📊</div>
                <p className="text-sm text-muted-foreground">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </section>
  )
}
