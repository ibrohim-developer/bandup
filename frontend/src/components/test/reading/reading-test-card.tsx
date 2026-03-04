import { Clock, HelpCircle, CheckCircle } from "lucide-react";
import { DifficultyDots } from "@/components/test/common/difficulty-dots";
import { LoginRequiredLink } from "@/components/auth/login-required-link";

export interface ReadingTestItem {
  id: string;
  title: string;
  difficulty: string;
  duration: number;
  questions: number;
  part: number;
  type: string;
  isCompleted: boolean;
}

export function ReadingTestCard({ test }: { test: ReadingTestItem }) {
  return (
    <div className="bg-card border border-border p-4 md:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 md:mb-2">
          <h3 className="text-lg md:text-xl font-bold truncate">
            {test.title}
          </h3>
          {test.isCompleted && (
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 shrink-0">
              <CheckCircle className="h-4 w-4" />
              Completed
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground font-bold uppercase mb-3 md:mb-4">
          Part {test.part} -{" "}
          {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
        </p>
        <div className="flex items-center gap-4 md:gap-6 text-xs font-bold text-muted-foreground">
          <DifficultyDots difficulty={test.difficulty} />
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {test.duration} mins
          </span>
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            {test.questions} questions
          </span>
        </div>
      </div>
      <LoginRequiredLink
        href={`/dashboard/reading/${test.id}`}
        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-black text-xs tracking-widest hover:opacity-90 transition-all uppercase text-center w-full md:w-auto"
      >
        {test.isCompleted ? "Retake" : "Start Test"}
      </LoginRequiredLink>
    </div>
  );
}
