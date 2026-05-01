import type { Metadata } from "next";
import { cache } from "react";
import { findOne } from "@/lib/strapi/api";
import { TestContextMenu } from "@/components/test/common/test-context-menu";

const getTest = cache(async (testId: string) => {
  return findOne("tests", testId);
});

type Props = { params: Promise<{ testId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testId } = await params;
  const test = await getTest(testId);
  if (!test) return { title: "Test Not Found" };

  const title = `Free IELTS Reading Practice Test: ${test.title || "Practice Exam"} with Answers (${new Date().getFullYear()}) – BandUp`;
  const description =
    `Practice IELTS Reading for free with our '${test.title || "Practice Exam"}' mock exam. Includes real test format, answers, and instant AI-powered band scoring.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bandup.uz/dashboard/reading/${testId}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/reading/${testId}`,
    },
  };
}

export default function ReadingTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {children}
      <TestContextMenu module="reading" />
    </div>
  );
}
