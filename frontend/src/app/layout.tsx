import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/components/query-provider";
import { GoogleAnalytics } from "@/components/google-analytics";
import { JsonLd } from "@/components/json-ld";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bandup.uz"),
  title: {
    default: "BandUp — Free IELTS Mock Exams & Practice Tests",
    template: "%s | BandUp IELTS",
  },
  description:
    "Prepare for IELTS with free mock exams, practice tests, and detailed AI-powered score analysis. Take a free reading test with answers, free listening test with answers, and try free writing and speaking practice with instant band score evaluation.",
  keywords: [
    "IELTS mock exam",
    "IELTS practice test",
    "IELTS preparation",
    "IELTS online test",
    "IELTS Uzbekistan",
    "IELTS tayyorgarlik",
    "IELTS mock test free",
    "IELTS band score",
    "Free Reading test with answers",
    "Free Listening test with answers",
    "Free Writing with instant band score",
    "Free Speaking with instant band score",
  ],
  authors: [{ name: "BandUp Team", url: "https://bandup.uz" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bandup.uz",
    siteName: "BandUp IELTS",
    title: "BandUp — Free IELTS Mock Exams & Practice Tests",
    description:
      "Prepare for IELTS with free mock exams and detailed AI-powered score analysis. Access free reading/listening tests with answers and free writing/speaking evaluation.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BandUp — Free IELTS Mock Exams & Practice Tests",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BandUp — Free IELTS Mock Exams & Practice Tests",
    description:
      "Free IELTS mock exams and practice tests with AI-powered scoring.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: { canonical: "https://bandup.uz" },
  verification: { google: "google-site-verification=mGZCMSg3RtjuODnMsT5gmZUg1vK2SX0HAnOkHIvD_6Y" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "BandUp",
  url: "https://bandup.uz",
  // logo: "https://bandup.uz/logo.png", // TODO: add logo.png to /public and uncomment
  description:
    "Free IELTS mock exams and practice tests with detailed AI-powered score analysis. Free reading and listening tests with answers included.",
  sameAs: ["https://t.me/bandup_ielts", "https://instagram.com/bandupuz"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BandUp IELTS",
  url: "https://bandup.uz",
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BandUp IELTS Mock Test App",
  url: "https://bandup.uz",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "AI-powered web application for taking IELTS mock exams. Take free reading and listening practice tests with answers, plus free writing and speaking evaluation.",
  featureList: [
    "AI Writing Evaluation",
    "AI Speaking Evaluation",
    "Real Exam Format Simulation",
    "Free IELTS Mock Exams",
    "Free reading test with answers",
    "Free listening test with answers",
    "Listening, Reading, Writing, Speaking Modules",
    "Instant Band Scoring",
    "Free Writing with instant band score",
    "Free Speaking with instant band score",
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={softwareSchema} />
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <TelegramProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </TelegramProvider>
        </Suspense>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
