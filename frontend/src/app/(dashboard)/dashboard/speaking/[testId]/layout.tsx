import type { Metadata } from "next";
import { cache } from "react";
import { findOne } from "@/lib/strapi/api";
import { ReportIssueButton } from "@/components/report-issue-button";
import { TestContextMenu } from "@/components/test/common/test-context-menu";

const getTest = cache(async (testId: string) => {
  return findOne("tests", testId);
});

type Props = { params: Promise<{ testId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testId } = await params;
  const test = await getTest(testId);
  if (!test) return { title: "Test Not Found" };

  const title = `Free IELTS Speaking Practice Test: ${test.title || "Practice Exam"} with AI Evaluation (${new Date().getFullYear()}) – BandUp`;
  const description =
    `Practice IELTS Speaking Part 1, 2, and 3 for free with our '${test.title || "Practice Exam"}' mock exam. Get instant AI band scoring and pronunciation feedback.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bandup.uz/dashboard/speaking/${testId}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/speaking/${testId}`,
    },
  };
}

export default function SpeakingTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ReportIssueButton module="speaking" />
      <TestContextMenu module="speaking" />
    </>
  );
}
