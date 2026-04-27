'use client'

import { Check } from 'lucide-react'

const timeline = [
  {
    step: '1',
    title: 'Application Review',
    description: 'Submit your center information. Our team reviews your application within 24-48 hours.',
    time: '1-2 days'
  },
  {
    step: '2',
    title: 'Demo & Training',
    description: 'Get a personalized demo and hands-on training for your team. We ensure smooth adoption.',
    time: '3-5 days'
  },
  {
    step: '3',
    title: 'Setup & Onboarding',
    description: 'We configure your dashboard, set up classes, and migrate your student data if needed.',
    time: '1 week'
  },
  {
    step: '4',
    title: 'Go Live!',
    description: 'Launch with your students. Get ongoing support from your dedicated partner manager.',
    time: 'Ready'
  }
]

export function PartnerTimeline() {
  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            How It Works: Partnership Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in just 1 week
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="rounded-xl border border-border bg-background p-6 text-center min-h-48 flex flex-col justify-center">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="mb-4 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                <div className="flex items-center justify-center gap-1 text-xs font-medium text-accent">
                  <Check className="size-3" />
                  {item.time}
                </div>
              </div>

              {idx < timeline.length - 1 && (
                <div className="absolute top-1/2 -right-3 hidden md:block w-6 h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
