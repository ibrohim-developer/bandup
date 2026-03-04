import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import { JsonLd } from "@/components/json-ld";
import { getUser } from "@/actions/auth";
import { Suspense } from "react";
import { Target, Zap, Globe, Users } from "lucide-react";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bandup.uz" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://bandup.uz/about" },
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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ForceLightTheme />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={<Header />}>
        <AuthHeader />
      </Suspense>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 lg:py-32 border-b border-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-8xl font-black text-black uppercase tracking-tighter mb-8 leading-[0.9]">
              About <span className="text-primary">BandUp</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl font-normal leading-snug">
              BandUp is Uzbekistan&apos;s AI-powered IELTS preparation platform, built to make
              high-quality test practice accessible to every student.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 lg:py-32 border-b border-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter mb-4">
                Our Mission
              </h2>
              <div className="h-3 w-24 bg-primary"></div>
            </div>
            <p className="text-lg md:text-xl text-neutral-600 max-w-3xl font-normal leading-relaxed">
              Every year, over 50,000 people in Uzbekistan take the IELTS exam. Many pay
              hundreds of dollars for mock tests and preparation materials. We believe that
              quality IELTS practice should be free and accessible to everyone, regardless
              of their financial situation. BandUp provides real exam-format mock tests with
              instant AI-powered scoring and feedback — completely free.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-20 lg:py-32 border-b border-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter mb-4">
                What We Offer
              </h2>
              <div className="h-3 w-24 bg-primary"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 border border-black rounded-2xl">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <Target className="text-white w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Real Exam Format
                </h3>
                <p className="text-neutral-600 font-normal leading-snug">
                  Practice with tests that strictly follow the official IELTS format —
                  Listening, Reading, Writing, and Speaking modules with authentic time
                  constraints.
                </p>
              </div>
              <div className="p-8 border border-black rounded-2xl">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-6">
                  <Zap className="text-white w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  AI-Powered Scoring
                </h3>
                <p className="text-neutral-600 font-normal leading-snug">
                  Get instant band score predictions with detailed breakdowns of your
                  performance. Our AI models are trained on thousands of examiner-graded
                  scripts.
                </p>
              </div>
              <div className="p-8 border border-black rounded-2xl">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-6">
                  <Globe className="text-white w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Made for Uzbekistan
                </h3>
                <p className="text-neutral-600 font-normal leading-snug">
                  Built locally with an understanding of the challenges Uzbek students face
                  when preparing for international English exams.
                </p>
              </div>
              <div className="p-8 border border-black rounded-2xl">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <Users className="text-white w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Free for Everyone
                </h3>
                <p className="text-neutral-600 font-normal leading-snug">
                  No paywalls, no hidden fees. BandUp provides free access to mock tests so
                  every student can prepare effectively.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-[8px] border-primary p-8 md:p-16 text-center bg-white rounded-3xl">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
                Start Preparing <span className="text-primary">Today</span>
              </h2>
              <p className="text-xl text-neutral-600 mb-10 max-w-xl mx-auto font-normal leading-snug">
                Take your first free mock test and see where you stand.
              </p>
              <Link
                href="/dashboard/reading"
                className="inline-block bg-primary text-white px-12 py-5 font-black uppercase text-sm tracking-[0.2em] hover:bg-primary/90 transition-all rounded-xl"
              >
                Free Mock Test
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
