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

  const title = test.title || "IELTS Writing Practice Test";
  const description =
    test.description ||
    `Practice IELTS Writing with this free mock test on BandUp. Get AI-powered feedback and improve your band score.`;

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
  return children;
}
