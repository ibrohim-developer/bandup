import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import { JsonLd } from "@/components/json-ld";
import { getUser } from "@/actions/auth";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ - IELTS & BandUp",
  description: "Frequently asked questions about IELTS and BandUp.",
};

const faqs = [
  // BandUp product questions
  {
    question: "Is there a free trial?",
    answer:
      "Everything on BandUp is free — Listening, Reading, Writing, and Speaking practice with AI feedback. The only paid part is full mock tests, and even there your first mock test is free so you can try it before paying.",
  },
  {
    question: "How accurate is the AI scoring?",
    answer:
      "Our AI scoring uses the official IELTS band descriptors as its rubric to evaluate Writing and Speaking responses. Predicted band scores are typically within ~0.5–1 band of an examiner's score, and we keep refining the prompts and rubric checks to improve accuracy.",
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
    question: "How is BandUp different from other IELTS prep apps?",
    answer:
      "BandUp is the only platform that provides instant AI feedback across all four IELTS modules with detailed band score predictions. Most apps only cover Reading and Listening. We also offer full mock exams under real conditions, progress tracking, and speaking practice with AI evaluation.",
  },
  {
    question: "Can I use BandUp on my phone?",
    answer:
      "Yes, BandUp is fully responsive and works on mobile browsers, but we recommend using it on a computer or laptop for the best experience. For Speaking practice, you just need a working microphone.",
  },
  // General IELTS questions
  {
    question: "What is the difference between IELTS Academic and General Training?",
    answer:
      "IELTS Academic is for higher education and professional registration. General Training is for migration and secondary education. Both share Listening and Speaking sections but differ in Reading and Writing content.",
  },
  {
    question: "How is IELTS scored?",
    answer:
      "IELTS uses a 9-band system. You receive individual scores for Listening, Reading, Writing, and Speaking, plus an Overall Band Score that averages these four, rounded to the nearest whole or half band.",
  },
  {
    question: "How long is the IELTS test?",
    answer:
      "The total IELTS test takes about 2 hours and 45 minutes: Listening (30 minutes), Reading (60 minutes), Writing (60 minutes), and Speaking (11–14 minutes, may be on a separate day).",
  },
  {
    question: "Can I retake just one section of IELTS?",
    answer:
      "Yes. IELTS One Skill Retake lets you retake a single section within 60 days of your original test date at participating centers.",
  },
  {
    question: "Where can I take IELTS in Uzbekistan?",
    answer:
      "IELTS is available at British Council and IDP testing centers across Uzbekistan, including Tashkent, Samarkand, and other major cities. You can register through exams.uz (IDP) or britishcouncil.uz.",
  },
  {
    question: "How often should I practice with mock tests?",
    answer:
      "For optimal preparation, we recommend taking at least 2–3 full mock tests per week, with daily practice on individual modules. Consistent practice over 4–8 weeks typically yields significant score improvements.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bandup.uz" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://bandup.uz/faq" },
  ],
};

async function AuthNavbar() {
  const user = await getUser();
  return (
    <Navbar
      isLoggedIn={!!user}
      userEmail={user?.email}
      userAvatar={user?.user_metadata?.avatar_url}
      userName={user?.user_metadata?.full_name}
    />
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ForceLightTheme />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={<Navbar />}>
        <AuthNavbar />
      </Suspense>

      <main className="flex-1 pt-[72px]">
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                FAQ
              </p>
              <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Frequently asked questions
              </h1>
              <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                Everything you need to know about BandUp and IELTS
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

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Still have questions?
              </p>
              <Link
                href="https://t.me/bandup_admin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                Ask us on Telegram
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Ready to start practicing?
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Take a free IELTS mock test and get your band score instantly.
            </p>
            <Link
              href="/dashboard/reading"
              className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Free Mock Test
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
