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

  const title = `Free IELTS Listening Practice Test: ${test.title || "Practice Exam"} with Audio & Answers (${new Date().getFullYear()}) – BandUp`;
  const description =
    `Practice IELTS Listening for free with our '${test.title || "Practice Exam"}' mock test. Includes high-quality audio, full transcript answers, and instant band scoring.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bandup.uz/dashboard/listening/${testId}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/listening/${testId}`,
    },
  };
}

export default function ListeningTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
