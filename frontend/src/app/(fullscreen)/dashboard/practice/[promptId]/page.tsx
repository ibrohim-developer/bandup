import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeSession } from "@/components/practice/practice-session";
import { PRACTICE_ENABLED } from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: "Speaking Practice — Talk with an AI Partner",
  // Transient per-attempt session pages shouldn't be indexed.
  robots: { index: false, follow: false },
};

export default async function PracticeTopicPage({
  params,
}: {
  params: Promise<{ promptId: string }>;
}) {
  if (!PRACTICE_ENABLED) notFound();
  const { promptId } = await params;
  return (
    <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-6">
      <PracticeSession promptId={promptId} />
    </div>
  );
}
