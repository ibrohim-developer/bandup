import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BandUp for Business — IELTS Preparation for Learning Centers",
  description:
    "Partner with BandUp to offer AI-powered IELTS mock exams to your students. Scalable IELTS preparation solutions for learning centers in Uzbekistan.",
  alternates: { canonical: "https://bandup.uz/for-business" },
  openGraph: {
    title: "BandUp for Business — IELTS Preparation for Learning Centers",
    description:
      "AI-powered IELTS mock exams for learning centers and educational institutions.",
    url: "https://bandup.uz/for-business",
  },
};

export default function ForBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
