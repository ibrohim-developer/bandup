import type { Metadata } from "next";
import { cache } from "react";
import { findOne } from "@/lib/strapi/api";
import { ReportIssueButton } from "@/components/report-issue-button";
import { TestContextMenu } from "@/components/test/common/test-context-menu";

const getTopic = cache(async (topicId: string) => {
  return findOne("speaking-topics", topicId);
});

type Props = { params: Promise<{ topicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId } = await params;
  const topic = await getTopic(topicId);
  if (!topic) return { title: "Topic Not Found" };

  const title = `Free IELTS Speaking Practice Test: ${topic.topic || "General Practice"} with AI Evaluation (${new Date().getFullYear()}) – BandUp`;
  const description =
    `Practice IELTS Speaking Part 1, 2, and 3 for free. Discuss '${topic.topic || "General Practice"}' and get instant AI band scoring and pronunciation feedback.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bandup.uz/dashboard/speaking/${topicId}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/speaking/${topicId}`,
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
