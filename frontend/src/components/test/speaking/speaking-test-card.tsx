import { CheckCircle, Layers, ChevronRight } from "lucide-react";
import { LoginRequiredLink } from "@/components/auth/login-required-link";
import type { SpeakingTestItem } from "@/app/(dashboard)/dashboard/speaking/questions/actions";

export function SpeakingTestCard({ test }: { test: SpeakingTestItem }) {
  return (
    <div className="bg-card border border-border p-4 md:p-6 rounded-2xl flex flex-row items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg md:text-xl font-bold truncate">{test.title}</h3>
          {test.isCompleted && (
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 shrink-0">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Completed</span>
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground font-bold uppercase mb-3 md:mb-4">
          {test.topics.map((t) => `Part ${t.partNumber}`).join(" · ")}
        </p>
        <div className="flex items-center gap-4 md:gap-6 text-xs font-bold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            {test.topics.length} {test.topics.length === 1 ? "Part" : "Parts"}
          </span>
        </div>
      </div>
      <LoginRequiredLink
        href={`/dashboard/speaking/${test.slug}`}
        className="shrink-0 flex items-center gap-0.5 font-bold text-base text-primary hover:opacity-80 transition-all md:gap-1 md:text-primary-foreground md:bg-primary md:px-6 md:py-2.5 md:rounded-xl md:hover:opacity-90"
      >
        {test.isCompleted ? "Retake" : "Start"}
        <ChevronRight className="h-5 w-5 md:h-4 md:w-4" />
      </LoginRequiredLink>
    </div>
  );
}
