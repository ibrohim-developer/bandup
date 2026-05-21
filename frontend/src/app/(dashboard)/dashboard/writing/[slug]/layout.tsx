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

  const title = `Free IELTS Writing Practice Test: ${test.title || "Practice Exam"} with AI Evaluation`;
  const description =
    `Practice IELTS Writing Task 1 and Task 2 for free. Try '${test.title || "Practice Exam"}' and get instant AI-powered band score predictions and detailed grammar feedback.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bandup.uz/dashboard/writing/${slug}`,
    },
    alternates: {
      canonical: `https://bandup.uz/dashboard/writing/${slug}`,
    },
  };
}

export default async function WritingTestLayout({ params, children }: Props) {
  const { slug } = await params;
  const test = await getTest(slug);
  if (test?.slug && slug !== test.slug) {
    redirect(`/dashboard/writing/${test.slug}`);
  }
  const testName = test?.title || "Practice Exam";
  const url = `https://bandup.uz/dashboard/writing/${slug}`;

  const learningResourceSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `IELTS Writing Practice Test: ${testName}`,
    url,
    educationalLevel: "Intermediate to Advanced",
    learningResourceType: "Practice Test",
    inLanguage: "en",
    timeRequired: "PT60M",
    about: { "@type": "Thing", name: "IELTS Writing" },
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
      { "@type": "ListItem", position: 2, name: "Writing", item: "https://bandup.uz/dashboard/writing" },
      { "@type": "ListItem", position: 3, name: testName, item: url },
    ],
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <JsonLd data={learningResourceSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
      <TestContextMenu module="writing" />
    </div>
  );
}
