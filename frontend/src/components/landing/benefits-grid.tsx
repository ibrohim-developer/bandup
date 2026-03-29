'use client'

import { BarChart3, Users, TrendingUp, Settings, Zap, Award } from 'lucide-react'

const benefits = [
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Track student progress with comprehensive dashboards. Monitor scores, identify weak areas, and measure improvement.'
  },
  {
    icon: Users,
    title: 'Bulk Student Management',
    description: 'Manage hundreds of students at once. Create classes, assign tasks, and monitor performance in real-time.'
  },
  {
    icon: TrendingUp,
    title: 'Proven Results',
    description: 'Students using BandUp see an average band score improvement of 1.5-2 points in 6-8 weeks.'
  },
  {
    icon: Settings,
    title: 'White-Label Option',
    description: 'Customize the platform with your branding. Keep students on your platform while using our technology.'
  },
  {
    icon: Zap,
    title: 'Instant AI Feedback',
    description: 'Get immediate feedback on writing and speaking. No waiting for teachers—instant, detailed corrections 24/7.'
  },
  {
    icon: Award,
    title: 'Expert Support',
    description: 'Dedicated partner manager, training sessions, and ongoing technical support for your team.'
  }
]

export function BenefitsGrid() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Why Partner with BandUp?
          </h2>
          <p className="text-lg text-muted-foreground">
            Give your center a competitive edge with our advanced platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/10"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Icon className="size-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
