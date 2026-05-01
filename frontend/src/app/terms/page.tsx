import { Navbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import { getUser } from "@/actions/auth";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read BandUp's Terms of Service to understand your rights and responsibilities when using our platform.",
  alternates: { canonical: "https://bandup.uz/terms" },
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
    title: "1. Acceptance of Terms",
    content: `By creating an account or using BandUp ("the Platform"), you agree to these Terms of Service. If you do not agree, do not use the Platform.

These Terms apply to all users of bandup.uz.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 16 years old to use BandUp. By creating an account, you confirm that you meet this requirement.`,
  },
  {
    title: "3. Your Account",
    content: `You are responsible for maintaining the security of your account credentials. Your account is personal and may not be shared with, transferred to, or used by any other person.

If we determine that an account is being shared or used by multiple people, we reserve the right to suspend or terminate that account without a refund.

You must provide accurate information when registering and keep it up to date.`,
  },
  {
    title: "4. Acceptable Use",
    content: `You agree not to:

— Share your account with other people or allow others to use your account
— Scrape, copy, or redistribute test content, questions, or answers from the Platform
— Attempt to reverse-engineer, bypass, or interfere with any part of the Platform
— Use the Platform for any unlawful purpose
— Impersonate another person or misrepresent your identity
— Upload or submit content that is harmful, offensive, or violates any applicable law

We reserve the right to suspend or terminate accounts that violate these rules.`,
  },
  {
    title: "5. Free and Paid Services",
    content: `BandUp provides both free and paid services:

Free: Individual module practice (Reading, Listening, Writing, Speaking) is available at no cost.

Paid: Full mock tests are available for purchase. Each user receives one free full mock test. Additional full mock tests require payment.

Prices are displayed on the Platform before purchase and may change at any time. Changes do not affect purchases already made.`,
  },
  {
    title: "6. Payments",
    content: `Payments are processed securely by a third-party payment provider. BandUp does not store your card details.

By completing a purchase, you confirm that you are authorised to use the payment method provided.`,
  },
  {
    title: "7. Refund Policy",
    content: `If you are not satisfied with a paid full mock test, you may request a refund within 7 days of your purchase date.

To request a refund, contact us on Telegram at @bandup_admin with your purchase details. We will process eligible refunds within a reasonable time.

Refunds will not be issued for purchases older than 7 days, or where there is evidence of a violation of these Terms.`,
  },
  {
    title: "8. Intellectual Property",
    content: `All content on BandUp — including test questions, passages, audio recordings, UI design, and software — is the property of BandUp or its licensors and is protected by applicable intellectual property laws.

You may not copy, reproduce, distribute, or create derivative works from any Platform content without our prior written permission.

Content you submit (essays, speaking recordings) remains yours. You grant BandUp a limited licence to process and evaluate your submissions using AI tools for the purpose of providing the service.`,
  },
  {
    title: "9. AI-Generated Feedback",
    content: `BandUp uses AI models to evaluate Writing and Speaking submissions and predict band scores. These predictions are estimates only and are not official IELTS scores.

BandUp is not affiliated with, endorsed by, or certified by IELTS, the British Council, IDP, or Cambridge Assessment English. Band score predictions should be used as a guide for preparation, not as a substitute for an official IELTS test result.`,
  },
  {
    title: "10. Disclaimer of Warranties",
    content: `BandUp is provided "as is" without warranties of any kind. We do not guarantee that:

— The Platform will be available at all times or free from errors
— AI band score predictions will match your actual IELTS result
— Using BandUp will result in a specific score improvement

We will make reasonable efforts to keep the Platform available and accurate.`,
  },
  {
    title: "11. Limitation of Liability",
    content: `To the fullest extent permitted by law, BandUp shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform, including loss of data or failure to achieve a target band score.

Our total liability to you for any claim arising from use of the Platform shall not exceed the amount you paid to BandUp in the 30 days preceding the claim.`,
  },
  {
    title: "12. Termination",
    content: `We may suspend or terminate your account at any time if you violate these Terms. You may delete your account at any time by contacting us at @bandup_admin.

Upon termination, your access to the Platform will cease. Paid purchases are non-refundable upon termination for Terms violations.`,
  },
  {
    title: "13. Changes to These Terms",
    content: `We may update these Terms from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of BandUp after changes are posted constitutes your acceptance of the updated Terms.`,
  },
  {
    title: "14. Governing Law",
    content: `These Terms are governed by and construed in accordance with the laws of the Republic of Uzbekistan. Any disputes arising from these Terms or your use of BandUp shall be subject to the jurisdiction of the courts of Uzbekistan.`,
  },
  {
    title: "15. Contact",
    content: `For any questions about these Terms, contact us on Telegram: @bandup_admin`,
  },
];

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: April 29, 2026
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
