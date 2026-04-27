import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import { JsonLd } from "@/components/json-ld";
import { getUser } from "@/actions/auth";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Headphones, Pencil, Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "IELTS Tips — Strategies for Band 7+",
  description:
    "Practical IELTS tips and strategies for Reading, Listening, Writing, and Speaking. Learn how to maximise your band score with expert advice.",
  alternates: { canonical: "https://bandup.uz/ielts-tips" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I improve my IELTS Reading score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Skim each passage before reading the questions, watch for paraphrasing of key words, and manage your time at 20 minutes per passage. For True/False/Not Given questions, 'Not Given' means the passage simply doesn't address the statement.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best IELTS Listening strategies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Read the questions before the audio starts, listen for contrast signals (however, but, actually) which often precede the answer, and remember that spelling mistakes count as wrong answers.",
      },
    },
    {
      "@type": "Question",
      name: "How do I write a good IELTS Task 2 essay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Spend 5 minutes planning before writing. Write a clear thesis in your introduction, develop one main idea per body paragraph with a supporting example, and aim for at least 250 words. Use linking words to connect ideas.",
      },
    },
    {
      "@type": "Question",
      name: "How can I improve my IELTS Speaking score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Don't memorise scripts — examiners are trained to detect them. Extend your answers naturally, use a range of vocabulary, and for Part 2 use the full 2 minutes. Recording yourself is one of the most effective practice methods.",
      },
    },
  ],
};

const modules = [
  {
    value: "reading",
    label: "Reading",
    icon: BookOpen,
    href: "/dashboard/reading",
    cta: "Practice Reading",
    color: "text-blue-600",
    bg: "bg-blue-50",
    tips: [
      {
        title: "Skim first, questions second",
        body: "Spend 2–3 minutes skimming each passage before looking at the questions. Get a feel for the topic, structure, and where key information lives. This makes finding answers much faster.",
      },
      {
        title: "Answers are always in order",
        body: "For most question types (gap fill, short answer, TFNG), the answers follow the passage in order. If you found the answer to Q5 in paragraph 3, start looking for Q6 in paragraph 3 or later.",
      },
      {
        title: "Watch for paraphrasing",
        body: "The question will almost never use the exact words from the passage. Train yourself to match meaning, not wording. For example, 'costly' in the question might appear as 'expensive' in the text.",
      },
      {
        title: "True / False / Not Given — know the difference",
        body: "'False' means the passage directly contradicts the statement. 'Not Given' means the passage simply doesn't address it — the information is absent, not wrong. This is the most common trap.",
      },
      {
        title: "20 minutes per passage",
        body: "The IELTS Reading test has 3 passages and 60 minutes. Stick to 20 minutes per passage. If you're stuck on a question, mark it and move on — one difficult question shouldn't cost you three easy ones.",
      },
      {
        title: "Read the question type instructions carefully",
        body: "If the instruction says 'NO MORE THAN TWO WORDS', writing three words is an automatic zero even if your answer is correct. Always check the word limit before answering.",
      },
    ],
  },
  {
    value: "listening",
    label: "Listening",
    icon: Headphones,
    href: "/dashboard/listening",
    cta: "Practice Listening",
    color: "text-green-600",
    bg: "bg-green-50",
    tips: [
      {
        title: "Read questions before the audio starts",
        body: "You get time before each section to read the questions. Use every second of it. Knowing what to listen for lets you focus on the relevant information and ignore the rest.",
      },
      {
        title: "Listen for contrast signals",
        body: "Words like 'however', 'but', 'actually', 'in fact', and 'although' often signal that the correct answer is about to come. Speakers frequently correct or contradict themselves right before the key information.",
      },
      {
        title: "Spelling counts",
        body: "A correctly heard answer with a spelling mistake is marked wrong. Practise spelling common IELTS vocabulary — names, places, days, months, and subject-specific terms that appear in Section 4.",
      },
      {
        title: "Answers come in order",
        body: "Like Reading, Listening answers follow the order of the questions. You will never need to go back. If you miss an answer, let it go and focus on the next question — chasing it will cost you more.",
      },
      {
        title: "Never leave a blank",
        body: "There is no penalty for a wrong answer. If you missed something, write your best guess. A blank is always wrong; a guess has a chance of being right.",
      },
      {
        title: "Practise with different accents",
        body: "IELTS uses British, Australian, American, and Canadian accents. If you only practise with one accent, unfamiliar ones can slow your comprehension. BandUp's listening tests include a variety of accents.",
      },
    ],
  },
  {
    value: "writing",
    label: "Writing",
    icon: Pencil,
    href: "/dashboard/writing",
    cta: "Practice Writing",
    color: "text-orange-600",
    bg: "bg-orange-50",
    tips: [
      {
        title: "Plan before you write (5 minutes)",
        body: "Spending 5 minutes planning your essay structure before writing saves time overall. A well-structured essay is faster to write and scores higher on Coherence & Cohesion than a disorganised essay written quickly.",
      },
      {
        title: "Task 2 is worth twice Task 1",
        body: "Task 2 (250 words) contributes more to your Writing band score than Task 1 (150 words). If you're running low on time, prioritise completing Task 2 over perfecting Task 1.",
      },
      {
        title: "One clear idea per paragraph",
        body: "Each body paragraph should develop one main idea: topic sentence → explanation → example → link back. Mixing multiple ideas in one paragraph hurts your Coherence score.",
      },
      {
        title: "Task 1 — describe the overview first",
        body: "Before describing specific data points, write an overview paragraph that captures the main trend or most significant feature. Examiners specifically look for this and it is one of the easiest marks to earn.",
      },
      {
        title: "Don't give your opinion in Task 1",
        body: "Task 1 is a purely descriptive task. Phrases like 'This is a negative trend' or 'Worryingly, the figures show...' introduce opinion, which is inappropriate for academic report writing.",
      },
      {
        title: "Use linking words — but don't overuse them",
        body: "Linking words (Furthermore, However, In contrast, As a result) improve cohesion. But starting every sentence with one looks unnatural and can lower your score. Use them purposefully, not mechanically.",
      },
    ],
  },
  {
    value: "speaking",
    label: "Speaking",
    icon: Mic,
    href: "/dashboard/speaking",
    cta: "Practice Speaking",
    color: "text-purple-600",
    bg: "bg-purple-50",
    tips: [
      {
        title: "Don't memorise scripts",
        body: "IELTS examiners are trained to detect memorised answers. If they suspect you're reciting a rehearsed script, they will change the topic and your Fluency score will suffer. Speak naturally from ideas, not from memory.",
      },
      {
        title: "Extend your answers",
        body: "One-word or one-sentence answers give the examiner nothing to assess. Use the AREA method: Answer → Reason → Example → Alternative. Even in Part 1, aim for 2–4 sentences per answer.",
      },
      {
        title: "Use the full 2 minutes in Part 2",
        body: "The long turn in Part 2 is a rare chance to demonstrate sustained fluency. Use your 1-minute preparation time to jot down 3–4 bullet points, then speak through each one. Stopping at 90 seconds is a missed opportunity.",
      },
      {
        title: "Vocabulary range matters more than complexity",
        body: "You don't need to use obscure words. You need to avoid repeating the same words. If you used 'important' once, say 'significant', 'crucial', or 'essential' next time. Examiners listen for variety.",
      },
      {
        title: "Self-correction is fine",
        body: "Correcting yourself mid-sentence is not penalised — it actually shows grammatical awareness. Saying 'I go — I went there last year' is better than confidently saying the wrong thing.",
      },
      {
        title: "Record yourself practising",
        body: "Most people are unaware of their own speaking habits — filler words, repetition, weak sentence endings. Recording yourself and listening back is one of the highest-impact practice habits for Speaking improvement.",
      },
    ],
  },
];

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

export default function IeltsTipsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ForceLightTheme />
      <JsonLd data={faqSchema} />
      <Suspense fallback={<Navbar />}>
        <AuthNavbar />
      </Suspense>

      <main className="flex-1 pt-[72px]">
        {/* Hero */}
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              IELTS Tips
            </p>
            <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Strategies to maximise your band score
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
              Practical tips for all four IELTS modules — Reading, Listening, Writing, and Speaking.
              Learn the patterns, avoid the traps, and practise smarter.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[900px] px-6">
            <Tabs defaultValue="reading">
              <TabsList className="grid w-full grid-cols-4 mb-10 h-auto">
                {modules.map((mod) => (
                  <TabsTrigger
                    key={mod.value}
                    value={mod.value}
                    className="flex items-center gap-2 py-3"
                  >
                    <mod.icon className="w-4 h-4 hidden sm:block" />
                    {mod.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {modules.map((mod) => (
                <TabsContent key={mod.value} value={mod.value}>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {mod.tips.map((tip) => (
                      <div
                        key={tip.title}
                        className="rounded-2xl border border-border bg-card p-6"
                      >
                        <h3 className="font-semibold text-foreground mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tip.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <Link
                      href={mod.href}
                      className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      {mod.cta} →
                    </Link>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-secondary/50 py-16 md:py-24">
          <div className="mx-auto max-w-[800px] px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Tips only go so far — practice makes the difference
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Take a free full mock exam and put these strategies to the test.
            </p>
            <Link
              href="/dashboard/full-mock-test"
              className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Take a Free Full Mock Test
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
