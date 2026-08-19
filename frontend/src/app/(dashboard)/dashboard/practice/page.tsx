import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeClient } from "@/components/practice/practice-client";
import { PRACTICE_ENABLED } from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: "Speaking Practice — Talk with an AI Partner",
  description:
    "Practise English conversation out loud with an AI partner. Get your grammar mistakes explained as you speak. Free on BandUp.",
  alternates: { canonical: "https://bandup.uz/dashboard/practice" },
};

export default function PracticePage() {
  if (!PRACTICE_ENABLED) notFound();
  return (
    <div className="pb-12">
      <PracticeClient />
    </div>
  );
}
