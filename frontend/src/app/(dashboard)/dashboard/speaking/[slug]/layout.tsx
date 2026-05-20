import type { Metadata } from "next";
import { cache } from "react";
import { findTestBySlugOrId } from "@/lib/strapi/api";
import { TestContextMenu } from "@/components/test/common/test-context-menu";

const getTest = cache(async (slug: string) => {
  return findTestBySlugOrId(slug);
});

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const test = await getTest(slug);
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
      url: `https://bandup.uz/dashboard/speaking/${slug}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/speaking/${slug}`,
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
      <TestContextMenu module="speaking" />
    </>
  );
}
