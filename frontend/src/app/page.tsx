import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { PainPoints } from "@/components/landing/pain-points";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AiDemo } from "@/components/landing/ai-demo";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import { JsonLd } from "@/components/json-ld";
import { getUser } from "@/actions/auth";
import { Suspense } from "react";

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Free IELTS Mock Exams & Practice Tests",
  description:
    "Prepare for IELTS with free mock exams and get instant AI-powered band score predictions. Take a free reading test with answers, free listening test with answers, and try free writing and speaking practice with instant band score evaluation.",
  provider: {
    "@type": "Organization",
    name: "BandUp",
    sameAs: "https://bandup.uz",
  },
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

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <ForceLightTheme />
      <JsonLd data={courseSchema} />

      <Suspense fallback={<Navbar />}>
        <AuthNavbar />
      </Suspense>

      <main className="flex-1">
        <Hero />
        <PainPoints />
        <Features />
        <HowItWorks />
        <AiDemo />
        <DashboardPreview />
        <Testimonials />
        {/* <Pricing /> */}
        <FAQ />
        <FinalCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
