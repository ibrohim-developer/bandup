import type { Metadata } from "next";
import Link from "next/link";
import { Users, List } from "lucide-react";

export const metadata: Metadata = {
  title: "IELTS Speaking Practice — Mock Exams & Questions",
  description:
    "Practice IELTS Speaking with mock exams and question lists. Improve your speaking band score on BandUp.",
  alternates: { canonical: "https://bandup.uz/dashboard/speaking" },
};

export default function SpeakingPage() {
  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-1">
          Speaking Practice
        </h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          Choose your practice mode
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 md:p-8 rounded-xl flex flex-col items-center text-center gap-4 relative opacity-75">
          <span className="absolute top-3 right-3 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
            Soon
          </span>
          <div className="bg-primary/10 p-4 rounded-full">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg md:text-xl font-bold">Mock Exam with Human</h3>
          <p className="text-sm text-muted-foreground">
            Practice with a real examiner and get personalized feedback on your
            speaking skills.
          </p>
          {/* <Link
            href="/dashboard/speaking/mock-exam"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-black text-xs tracking-widest hover:opacity-90 transition-all uppercase mt-auto"
          >
            View Examiners
          </Link> */}
          <span className="bg-muted text-muted-foreground px-8 py-3 rounded-lg font-black text-xs tracking-widest uppercase mt-auto cursor-not-allowed">
            View Examiners
          </span>
        </div>

        <div className="bg-card border border-border p-6 md:p-8 rounded-xl flex flex-col items-center text-center gap-4 relative">
          <div className="bg-primary/10 p-4 rounded-full">
            <List className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg md:text-xl font-bold">Question List</h3>
          <p className="text-sm text-muted-foreground">
            Browse speaking topics and practice questions organized by part.
          </p>
          <Link
            href="/dashboard/speaking/questions"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-black text-xs tracking-widest hover:opacity-90 transition-all uppercase mt-auto"
          >
            Browse Questions
          </Link>
        </div>
      </div>
    </div>
  );
}
