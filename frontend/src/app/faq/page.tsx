import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import { JsonLd } from "@/components/json-ld";
import { ChevronDown } from "lucide-react";
import { getUser } from "@/actions/auth";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - IELTS & BandUp",
  description: "Frequently asked questions about IELTS and BandUp.",
};

const faqs = [
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
    question: "Can I retake just one section of IELTS?",
    answer:
      "Yes. IELTS One Skill Retake lets you retake a single section within 60 days of your original test date at participating centers.",
  },
  {
    question: "How does BandUp's AI scoring work?",
    answer:
      "BandUp uses advanced AI models trained on examiner-graded scripts to evaluate your writing and provide instant band score predictions with detailed feedback on grammar, vocabulary, coherence, and task achievement.",
  },
  {
    question: "Is BandUp free to use?",
    answer:
      "Yes! BandUp offers free IELTS mock exams for Reading, Listening, and Writing modules. You can practice with real exam-style questions and get instant AI-powered feedback at no cost.",
  },
  {
    question: "How long is the IELTS test?",
    answer:
      "The total IELTS test takes about 2 hours and 45 minutes: Listening (30 minutes), Reading (60 minutes), Writing (60 minutes), and Speaking (11-14 minutes, may be on a separate day).",
  },
  {
    question: "Where can I take IELTS in Uzbekistan?",
    answer:
      "IELTS is available at British Council and IDP testing centers across Uzbekistan, including Tashkent, Samarkand, and other major cities. You can register through exams.uz (IDP) or britishcouncil.uz.",
  },
  {
    question: "How accurate are BandUp's mock test scores?",
    answer:
      "Our AI scoring models are calibrated against thousands of examiner-graded scripts. While no prediction is perfect, our scores typically fall within +/- 0.5 bands of actual IELTS scores.",
  },
  {
    question: "How often should I practice with mock tests?",
    answer:
      "For optimal preparation, we recommend taking at least 2-3 full mock tests per week, with daily practice on individual modules. Consistent practice over 4-8 weeks typically yields significant score improvements.",
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

async function AuthHeader() {
  const user = await getUser();
  return (
    <Header
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
      <Suspense fallback={<Header />}>
        <AuthHeader />
      </Suspense>

      <main className="flex-1">
        <section className="py-20 lg:py-32">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter mb-4">
                FAQ
              </h1>
              <div className="h-3 w-24 bg-primary"></div>
              <p className="text-xl text-neutral-600 mt-6 font-normal leading-snug">
                Frequently asked questions about IELTS and BandUp.
              </p>
            </div>

            <div className="space-y-0 border border-black divide-y divide-black bg-white rounded-2xl overflow-hidden">
              {faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="flex justify-between items-center p-6 md:p-8 cursor-pointer font-bold text-sm md:text-base select-none hover:bg-neutral-50 transition-colors">
                    {faq.question}
                    <ChevronDown className="w-5 h-5 shrink-0 ml-4 group-open:rotate-180 transition-transform group-open:text-primary" />
                  </summary>
                  <div className="px-6 md:px-8 pb-6 md:pb-8 text-neutral-600 text-base leading-relaxed font-normal">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-16 border-[4px] border-primary p-8 md:p-12 text-center bg-white rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tight">
                Ready to Start Practicing?
              </h2>
              <p className="text-neutral-600 mb-8 font-normal">
                Take a free IELTS mock test and get your band score instantly.
              </p>
              <Link
                href="/dashboard/reading"
                className="inline-block bg-primary text-white px-10 py-4 font-black uppercase text-sm tracking-[0.2em] hover:bg-primary/90 transition-all rounded-lg"
              >
                Start Free Mock Test
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
