'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'How much does it cost to partner with BandUp?',
    answer: "Pricing is customized based on your center's size, location, and needs. We offer flexible plans starting from entry-level for small centers up to enterprise solutions for large test centres. After you submit an application, our team will discuss your specific needs and provide a tailored quote."
  },
  {
    question: 'What if we already use another IELTS prep platform?',
    answer: "No problem! We can integrate with your existing systems or migrate your student data seamlessly. Our platform complements existing solutions and can be used alongside other tools. We'll work with your tech team to ensure smooth integration."
  },
  {
    question: 'Do you offer a white-label option?',
    answer: "Yes! Our Professional and Enterprise plans include white-label options. You can customize the platform with your branding, logo, and colors, so students feel like they're using your center's exclusive platform. We also offer white-label mobile apps for Enterprise customers."
  },
  {
    question: 'What kind of support do you provide after launch?',
    answer: 'All partners get dedicated support including: a dedicated account manager, regular check-in calls, training for your team, and technical support. Response times vary by plan (24-48 hours for Growth, priority for Professional, 24/5 for Enterprise).'
  },
  {
    question: 'Can we customize the AI feedback or add custom content?',
    answer: 'Absolutely! Professional and Enterprise partners can customize feedback guidelines, add custom mock exams, and integrate their own content. Our team will work with you to tailor the platform to your teaching methodology.'
  },
  {
    question: 'How does student data and privacy work?',
    answer: 'Student data is encrypted and stored securely on our servers. We comply with GDPR, CCPA, and other data protection regulations. You maintain full control over student data and can export it at any time. We never share or sell student data.'
  },
  {
    question: 'What happens if we want to cancel or change plans?',
    answer: 'We work on flexible contracts with 30-days notice for plan changes. If you need to pause or cancel, you can do so without penalties. We aim to make it a smooth transition and discuss any concerns with your dedicated manager.'
  },
  {
    question: 'How quickly can we get started?',
    answer: 'Most partners go live in about 1 week from application approval. This includes demo & training, setup & onboarding, and final testing. We work around your schedule to make the launch convenient for your center.'
  }
]

export function PartnerFAQ() {
  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Partner FAQ
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline hover:text-accent">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl border border-accent bg-accent/5 p-8 text-center">
          <p className="mb-4 text-foreground font-semibold">Have more questions?</p>
          <p className="text-muted-foreground mb-4">
            Contact our partnership team directly for a personalized consultation.
          </p>
          <a
            href="mailto:partnerships@bandup.uz"
            className="inline-block text-accent font-semibold hover:text-accent/80 transition-colors"
          >
            partnerships@bandup.uz
          </a>
        </div>
      </div>
    </section>
  )
}
