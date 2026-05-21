import type { Metadata } from "next";
import { cache } from "react";
import { redirect } from "next/navigation";
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

  const title = `Free IELTS Listening Practice Test: ${test.title || "Practice Exam"} with Audio & Answers`;
  const description =
    `Practice IELTS Listening for free with our '${test.title || "Practice Exam"}' mock test. Includes high-quality audio, full transcript answers, and instant band scoring.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bandup.uz/dashboard/listening/${slug}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/listening/${slug}`,
    },
  };
}

export default async function ListeningTestLayout({ params, children }: Props) {
  const { slug } = await params;
  const test = await getTest(slug);
  // 301 documentId URLs to the canonical slug URL so Google consolidates the
  // index entries. The slug fallback still serves the same content if the slug
  // field is missing.
  if (test?.slug && slug !== test.slug) {
    redirect(`/dashboard/listening/${test.slug}`);
  }
  const testName = test?.title || "Practice Exam";
  const url = `https://bandup.uz/dashboard/listening/${slug}`;

  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `IELTS Listening Practice Test: ${testName}`,
    url,
    educationalLevel: "Intermediate to Advanced",
    learningResourceType: "Practice Test",
    inLanguage: "en",
    timeRequired: "PT30M",
    about: { "@type": "Thing", name: "IELTS Listening" },
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
      { "@type": "ListItem", position: 2, name: "Listening", item: "https://bandup.uz/dashboard/listening" },
      { "@type": "ListItem", position: 3, name: testName, item: url },
    ],
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <JsonLd data={quizSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
      <TestContextMenu module="listening" />
    </div>
  );
}
