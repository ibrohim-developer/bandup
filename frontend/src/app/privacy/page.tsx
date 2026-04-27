import { Navbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import { getUser } from "@/actions/auth";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how BandUp collects, uses, and protects your personal data.",
  alternates: { canonical: "https://bandup.uz/privacy" },
  robots: { index: true, follow: true },
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

const sections = [
  {
    title: "1. Who We Are",
    content: `BandUp ("we", "us", "our") is an AI-powered IELTS preparation platform operating at bandup.uz. We provide free and paid mock exam services to help students prepare for the IELTS test.

For privacy-related questions, contact us on Telegram: @bandup_admin`,
  },
  {
    title: "2. Age Requirement",
    content: `BandUp is intended for users who are 16 years of age or older. By creating an account, you confirm that you are at least 16 years old. We do not knowingly collect personal data from anyone under 16. If we become aware that a user is under 16, we will delete their account and associated data.`,
  },
  {
    title: "3. Data We Collect",
    content: `When you use BandUp, we collect the following information:

Account data: Your name, email address, and profile picture (when signing in with Google OAuth).

Test data: Your answers to Reading and Listening questions, your Writing task responses (essays), and your Speaking recordings and transcripts.

Usage data: Your test scores, band score predictions, test history, and progress statistics.

Payment data: When you purchase a full mock test, payment is processed by our third-party payment provider. We do not store your card number or payment credentials — only the transaction result (success or failure) and what was purchased.

Technical data: An authentication token stored in a cookie, and standard server logs (IP address, browser type, pages visited).`,
  },
  {
    title: "4. How We Use Your Data",
    content: `We use your data to:

— Create and manage your account
— Deliver test content and evaluate your responses
— Generate AI-powered band score predictions and feedback
— Track your progress over time
— Process payments for full mock tests
— Improve the accuracy of our AI evaluation models
— Respond to your support requests
— Prevent fraud and ensure platform security`,
  },
  {
    title: "5. AI Evaluation & Third-Party Processors",
    content: `To provide AI-powered scoring for Writing and Speaking, your submitted essays and speaking recordings are sent to the following third-party AI services:

Google Gemini (Google LLC) — used for writing and speaking evaluation.
OpenAI (OpenAI, LLC) — used for writing and speaking evaluation.

Both providers process your content solely to return evaluation results. Please refer to their respective privacy policies for details on how they handle data:
— Google: policies.google.com/privacy
— OpenAI: openai.com/policies/privacy-policy

We do not sell your content to these providers or use it for advertising purposes.`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your personal data and test history for as long as your account remains active. We believe keeping your full history allows you to track long-term progress, which is core to the platform's value.

If you wish to delete your account and all associated data, contact us on Telegram at @bandup_admin and we will process your request within 30 days.`,
  },
  {
    title: "7. Cookies",
    content: `We use a single authentication cookie which stores your login session token. This cookie is:

— Strictly necessary for the platform to function
— Not used for advertising or tracking
— Removed when you sign out

We do not use third-party advertising cookies or tracking pixels.`,
  },
  {
    title: "8. Your Rights",
    content: `You have the right to:

— Access the personal data we hold about you
— Request correction of inaccurate data
— Request deletion of your account and all associated data
— Withdraw consent at any time (by deleting your account)

To exercise any of these rights, contact us on Telegram at @bandup_admin.`,
  },
  {
    title: "9. Payments",
    content: `BandUp offers one free full mock test per user. Additional full mock tests are available for purchase. Payment is processed securely by a third-party payment provider. BandUp does not store your card details.

All purchases are final. If you experience an issue with a payment, contact us at @bandup_admin.`,
  },
  {
    title: "10. Security",
    content: `We take reasonable technical and organisational measures to protect your data, including encrypted connections (HTTPS) and secure token-based authentication. However, no internet service can guarantee absolute security.`,
  },
  {
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of BandUp after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    title: "12. Contact",
    content: `For any privacy-related questions or requests, contact us on Telegram: @bandup_admin`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ForceLightTheme />
      <Suspense fallback={<Navbar />}>
        <AuthNavbar />
      </Suspense>

      <main className="flex-1 pt-[72px]">
        {/* Header */}
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Legal
            </p>
            <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: April 27, 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="rounded-2xl border border-border bg-card p-8 md:p-12 space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-semibold text-foreground mb-3">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
