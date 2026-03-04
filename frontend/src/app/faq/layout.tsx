import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions About IELTS",
  description:
    "Find answers to common questions about IELTS exam format, scoring, test dates in Uzbekistan, and how BandUp helps you prepare with free mock tests.",
  alternates: { canonical: "https://bandup.uz/faq" },
  openGraph: {
    title: "FAQ — Frequently Asked Questions About IELTS",
    description:
      "Find answers to common questions about IELTS exam format, scoring, and preparation.",
    url: "https://bandup.uz/faq",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
