import Link from "next/link";
import { Mic, CheckCircle, Layers } from "lucide-react";
import { DifficultyDots } from "@/components/test/common/difficulty-dots";
import { LoginRequiredLink } from "@/components/auth/login-required-link";
import type { SpeakingTestItem } from "@/app/(dashboard)/dashboard/speaking/questions/actions";

export function SpeakingTestCard({ test }: { test: SpeakingTestItem }) {
  return (
    <div className="bg-card border border-border p-4 md:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 md:mb-2">
          <h3 className="text-lg md:text-xl font-bold truncate">{test.title}</h3>
          {test.isCompleted && (
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 shrink-0">
              <CheckCircle className="h-4 w-4" />
              Completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-xs font-bold text-muted-foreground mt-3">
          <DifficultyDots difficulty={test.difficulty} />
          <span className="flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            {test.topics.length} {test.topics.length === 1 ? "Part" : "Parts"}
          </span>
        </div>
      </div>
      <LoginRequiredLink
        href={`/dashboard/speaking/test/${test.id}`}
        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-black text-xs tracking-widest hover:opacity-90 transition-all uppercase w-full md:w-auto"
      >
        <Mic className="h-3.5 w-3.5" />
        {test.isCompleted ? "Retake" : "Start Test"}
      </LoginRequiredLink>
    </div>
  );
}
