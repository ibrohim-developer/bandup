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
  name: "Free IELTS Practice & Mock Exams",
  description:
    "Practise IELTS Reading, Listening, Writing and Speaking for free, or take a full mock exam. Get instant AI-powered band score predictions and detailed feedback on every skill.",
  url: "https://bandup.uz",
  inLanguage: "en",
  educationalLevel: "Intermediate to Advanced",
  educationalCredentialAwarded: "IELTS Band Score Prediction",
  teaches: [
    "IELTS Reading",
    "IELTS Listening",
    "IELTS Writing",
    "IELTS Speaking",
  ],
  about: {
    "@type": "Thing",
    name: "IELTS (International English Language Testing System)",
  },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "Free",
    availability: "https://schema.org/InStock",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Online",
    courseWorkload: "PT3H",
    inLanguage: "en",
  },
  provider: {
    "@type": "EducationalOrganization",
    name: "BandUp",
    url: "https://bandup.uz",
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
        {/* <Testimonials /> */}
        <PainPoints />
        <Features />
        <HowItWorks />
        <AiDemo />
        <DashboardPreview />
        {/* <Pricing /> */}
        <FAQ />
        <FinalCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
