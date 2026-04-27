import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import { JsonLd } from "@/components/json-ld";
import { getUser } from "@/actions/auth";
import { Suspense } from "react";
import { Target, Zap, Globe, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BandUp",
  description: "Learn more about our mission to make high-quality test practice accessible to every student.",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bandup.uz" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://bandup.uz/about" },
  ],
};

const offerings = [
  {
    icon: Target,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "Real Exam Format",
    description:
      "Practice with tests that strictly follow the official IELTS format — Listening, Reading, Writing, and Speaking modules with authentic time constraints.",
  },
  {
    icon: Zap,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "AI-Powered Scoring",
    description:
      "Get instant band score predictions with detailed breakdowns of your performance. Our AI models are trained on thousands of examiner-graded scripts.",
  },
  {
    icon: Globe,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Made for Uzbekistan",
    description:
      "Built locally with an understanding of the challenges Uzbek students face when preparing for international English exams.",
  },
  {
    icon: Users,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "Free for Everyone",
    description:
      "No paywalls, no hidden fees. BandUp provides free access to mock tests so every student can prepare effectively.",
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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ForceLightTheme />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={<Navbar />}>
        <AuthNavbar />
      </Suspense>

      <main className="flex-1 pt-[72px]">
        {/* Hero */}
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              About Us
            </p>
            <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Making IELTS prep free for everyone
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
              BandUp is Uzbekistan&apos;s AI-powered IELTS preparation platform, built to make
              high-quality test practice accessible to every student — regardless of budget.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                Our Mission
              </p>
              <p className="text-foreground text-lg leading-relaxed">
                Every year, over 50,000 people in Uzbekistan take the IELTS exam. Many pay
                hundreds of dollars for mock tests and preparation materials. We believe that
                quality IELTS practice should be free and accessible to everyone, regardless
                of their financial situation.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                BandUp provides real exam-format mock tests with instant AI-powered scoring
                and feedback — completely free.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                What We Offer
              </p>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Everything you need to prepare
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {offerings.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-6 md:p-8"
                >
                  <div className={`w-10 h-10 ${item.iconBg} rounded-lg flex items-center justify-center mb-5`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Ready to start preparing?
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Take your first free mock test and see where you stand.
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
