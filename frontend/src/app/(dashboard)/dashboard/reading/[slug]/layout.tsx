import type { Metadata } from "next";
import { cache } from "react";
import { findTestBySlugOrId } from "@/lib/strapi/api";
import { TestContextMenu } from "@/components/test/common/test-context-menu";
import { JsonLd } from "@/components/json-ld";

const getTest = cache(async (slug: string) => {
  return findTestBySlugOrId(slug);
});

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const test = await getTest(slug);
  if (!test) return { title: "Test Not Found" };

  const title = `Free IELTS Reading Practice Test: ${test.title || "Practice Exam"} with Answers`;
  const description =
    `Practice IELTS Reading for free with our '${test.title || "Practice Exam"}' mock exam. Includes real test format, answers, and instant AI-powered band scoring.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bandup.uz/dashboard/reading/${slug}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/reading/${slug}`,
    },
  };
}

export default async function ReadingTestLayout({ params, children }: Props) {
  const { slug } = await params;
  const test = await getTest(slug);
  const testName = test?.title || "Practice Exam";
  const url = `https://bandup.uz/dashboard/reading/${slug}`;

  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `IELTS Reading Practice Test: ${testName}`,
    url,
    educationalLevel: "Intermediate to Advanced",
    learningResourceType: "Practice Test",
    inLanguage: "en",
    timeRequired: "PT60M",
    about: { "@type": "Thing", name: "IELTS Reading" },
    provider: {
      "@type": "EducationalOrganization",
      name: "BandUp",
      url: "https://bandup.uz",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bandup.uz" },
      { "@type": "ListItem", position: 2, name: "Reading", item: "https://bandup.uz/dashboard/reading" },
      { "@type": "ListItem", position: 3, name: testName, item: url },
    ],
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <JsonLd data={quizSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
      <TestContextMenu module="reading" />
    </div>
  );
}
