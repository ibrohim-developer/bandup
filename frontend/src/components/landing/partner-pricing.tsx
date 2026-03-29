'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Growth',
    price: 'Custom',
    description: 'Perfect for small to medium learning centers',
    students: '50-500 students',
    features: [
      'Unlimited student accounts',
      'All 4 IELTS modules (Speaking, Writing, Reading, Listening)',
      'Instant AI feedback & band predictions',
      'Basic analytics dashboard',
      'Email support',
      'Monthly check-ins with partner manager'
    ],
    highlighted: false
  },
  {
    name: 'Professional',
    price: 'Custom',
    description: 'For established centers with growing demand',
    students: '500-2000 students',
    features: [
      'Everything in Growth +',
      'Advanced analytics & reporting',
      'Custom branding (white-label ready)',
      'API access for integrations',
      'Priority support (phone & email)',
      'Quarterly strategy sessions',
      'Student progress reports (automated)',
      'Custom mock exam builder'
    ],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large test centers and franchises',
    students: '2000+ students',
    features: [
      'Everything in Professional +',
      'Dedicated account manager',
      'Custom SLA & uptime guarantee',
      'White-label mobile app option',
      'Single sign-on (SSO)',
      'Training & certification programs',
      'Custom feature development',
      'Premium support (24/5)',
      'Bulk student import tools'
    ],
    highlighted: false
  }
]

export function PartnerPricing() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Partner Pricing Plans
          </h2>
          <p className="text-lg text-muted-foreground">
            Transparent pricing based on your center&apos;s size and needs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={cn(
                'relative rounded-2xl border transition-all',
                plan.highlighted
                  ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10 ring-1 ring-accent/20 scale-105 md:scale-100'
                  : 'border-border bg-card hover:border-accent/50'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="mb-2 text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>

                <div className="mb-6 border-b border-border pb-6">
                  <div className="mb-1 text-sm font-medium text-muted-foreground">Starting from</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-accent">{plan.price}</span>
                  </div>
                  <div className="mt-3 text-sm font-medium text-foreground">{plan.students}</div>
                </div>

                <Button
                  className={cn(
                    'w-full rounded-full font-semibold h-10 mb-6',
                    plan.highlighted
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  Schedule Demo
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex gap-3 text-sm">
                      <Check className="size-5 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
