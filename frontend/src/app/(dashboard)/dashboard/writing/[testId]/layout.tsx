import type { Metadata } from "next";
import { cache } from "react";
import { findOne } from "@/lib/strapi/api";

const getTest = cache(async (testId: string) => {
  return findOne("tests", testId);
});

type Props = { params: Promise<{ testId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testId } = await params;
  const test = await getTest(testId);
  if (!test) return { title: "Test Not Found" };

  const title = `Free IELTS Writing Practice Test: ${test.title || "Practice Exam"} with AI Evaluation (${new Date().getFullYear()}) – BandUp`;
  const description =
    `Practice IELTS Writing Task 1 and Task 2 for free. Try '${test.title || "Practice Exam"}' and get instant AI-powered band score predictions and detailed grammar feedback.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bandup.uz/dashboard/writing/${testId}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/writing/${testId}`,
    },
  };
}

export default function WritingTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ fontFamily: 'Arial, sans-serif' }}>{children}</div>;
}
