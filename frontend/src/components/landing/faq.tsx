import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How accurate is the AI scoring?",
    answer:
      "Our AI scoring model has been trained on thousands of real IELTS essays and speaking samples graded by certified examiners. On average, our predicted band scores are within 0.5 bands of the actual IELTS score. We continuously improve accuracy with new data.",
  },
  {
    question: "Can I practice just one module?",
    answer:
      "Absolutely! You can practice any individual module — Speaking, Writing, Reading, or Listening — as many times as you want. You don't have to take a full mock exam every time. Many students focus on their weakest module first.",
  },
  {
    question: "What IELTS format do you cover — Academic or General?",
    answer:
      "We currently support the IELTS Academic format, which is the most common format for university admissions. General Training support is coming soon and will include all relevant question types and topics.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! You can start practicing for free immediately with our Free plan, which includes 2 practice sessions per day with basic AI feedback. No credit card required. Upgrade to Pro anytime to unlock unlimited practice.",
  },
  {
    question: "How is BandUp different from other IELTS prep apps?",
    answer:
      "BandUp is the only platform that provides instant AI feedback across all four IELTS modules with detailed band score predictions. Most apps only cover Reading and Listening. We also offer full mock exams under real conditions, progress tracking, and speaking practice with AI evaluation.",
  },
  {
    question: "Can I use BandUp on my phone?",
    answer:
      "Yes, BandUp is fully responsive and works great on mobile browsers. For Speaking practice, you just need a working microphone. A dedicated mobile app is in development and will be available soon.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-[800px] px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            FAQ
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Everything you need to know about BandUp
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
