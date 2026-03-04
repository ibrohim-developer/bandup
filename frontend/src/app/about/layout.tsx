import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BandUp — Free IELTS Preparation Platform",
  description:
    "BandUp is Uzbekistan's AI-powered IELTS preparation platform. Practice with real exam-style mock tests and get instant AI feedback on your band score.",
  alternates: { canonical: "https://bandup.uz/about" },
  openGraph: {
    title: "About BandUp — Free IELTS Preparation Platform",
    description:
      "Uzbekistan's AI-powered IELTS preparation platform with free mock tests and instant scoring.",
    url: "https://bandup.uz/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
