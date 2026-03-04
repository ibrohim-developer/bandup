import type { Metadata } from "next";
import Link from "@/components/no-prefetch-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { examiners } from "@/lib/data/examiners";

export const metadata: Metadata = {
  title: "IELTS Speaking Mock Exam — Choose an Examiner",
  description:
    "Choose an examiner for your IELTS Speaking mock exam. Practice with real examiners on BandUp.",
  alternates: {
    canonical: "https://bandup.uz/dashboard/speaking/mock-exam",
  },
};

export default function MockExamPage() {
  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-1">
          Choose an Examiner
        </h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          {examiners.length} Available Examiners
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {examiners.map((examiner) => (
          <Link
            key={examiner.id}
            href={`/dashboard/speaking/mock-exam/${examiner.id}`}
            className="bg-card border border-border p-4 md:p-6 rounded-xl flex flex-row sm:flex-col items-center sm:text-center gap-4 hover:border-primary/50 transition-colors"
          >
            <Avatar className="h-14 w-14 md:h-20 md:w-20 shrink-0">
              <AvatarImage src={examiner.image} alt={examiner.name} />
              <AvatarFallback className="bg-muted text-muted-foreground font-bold text-sm md:text-lg">
                {examiner.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 sm:flex sm:flex-col sm:items-center sm:gap-2">
              <h3 className="text-base md:text-lg font-bold truncate">
                {examiner.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-0">
                {examiner.bio}
              </p>
              <div className="flex items-center gap-2 md:gap-4 text-[11px] md:text-xs font-bold">
                <span className="bg-primary/10 text-primary px-2 py-0.5 md:px-2.5 md:py-1 rounded-md">
                  IELTS {examiner.ieltsOverall}
                </span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 md:px-2.5 md:py-1 rounded-md">
                  Speaking {examiner.speakingScore}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
