import { ForBusinessNavbar } from '@/components/landing/for-business-navbar'
import { LandingFooter } from '@/components/landing/footer'
import { ForBusinessesHero } from '@/components/landing/for-businesses-hero'
import { BenefitsGrid } from '@/components/landing/benefits-grid'
import { PartnerTimeline } from '@/components/landing/partner-timeline'
import { PartnerPricing } from '@/components/landing/partner-pricing'
import { PartnerApplicationForm } from '@/components/landing/partner-application-form'
import { PartnerFAQ } from '@/components/landing/partner-faq'

export default function ForBusinessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ForBusinessNavbar />
      <main className="flex-1">
        <ForBusinessesHero />
        <BenefitsGrid />
        <PartnerTimeline />
        {/* <PartnerPricing /> */}

        <section id="application-form" className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-[900px] px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
                Apply for Partnership
              </h2>
              <p className="text-lg text-muted-foreground">
                Complete the form below to start your partnership journey with BandUp
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
              <PartnerApplicationForm />
            </div>
          </div>
        </section>

        <PartnerFAQ />
      </main>
      <LandingFooter />
    </div>
  )
}
