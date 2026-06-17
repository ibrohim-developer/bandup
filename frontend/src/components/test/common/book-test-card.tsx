import { CheckCircle, ChevronRight } from "lucide-react";
import { DifficultyDots } from "@/components/test/common/difficulty-dots";
import { LoginRequiredLink } from "@/components/auth/login-required-link";
import type { BookGroup } from "@/lib/tests/book-grouping";

/**
 * Renders one "book" of module tests. A book with several tests shows them as
 * tiles inside a grouped card; a book with a single test (or a standalone test
 * that doesn't fit the "<Book> Test N" pattern) renders as a flat card.
 *
 * `basePath` is the module route the tests link to, e.g. "/dashboard/reading".
 */
export function BookTestCard({
  group,
  basePath,
}: {
  group: BookGroup;
  basePath: string;
}) {
  const typeLabel = group.type.charAt(0).toUpperCase() + group.type.slice(1);
  const testCount = group.tests.length;

  if (testCount === 1) {
    const test = group.tests[0];
    return (
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-extrabold tracking-tight truncate">
              {test.title}
            </h3>
            {test.isCompleted && (
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 shrink-0">
                <CheckCircle className="h-4 w-4" />
                Completed
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs md:text-[13px] font-semibold text-muted-foreground">
            {typeLabel} · {test.metric}
          </p>
          <div className="mt-3">
            <DifficultyDots difficulty={test.difficulty} />
          </div>
        </div>
        <LoginRequiredLink
          href={`${basePath}/${test.slug}`}
          className="shrink-0 flex items-center justify-center bg-primary text-primary-foreground px-6 md:px-8 py-3 rounded-lg font-bold text-sm tracking-wider uppercase hover:opacity-90 transition-all w-full md:w-auto"
        >
          {test.isCompleted ? "Retake" : "Start"}
        </LoginRequiredLink>
      </div>
    );
  }

  const uniformDifficulty = group.tests.every(
    (t) => t.difficulty === group.tests[0]?.difficulty,
  )
    ? group.tests[0]?.difficulty
    : null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
      {/* Book header */}
      <div className="flex items-start justify-between gap-4 mb-4 md:mb-5">
        <div className="min-w-0">
          <h3 className="text-lg md:text-xl font-extrabold tracking-tight truncate">
            {group.bookTitle}
          </h3>
          <p className="mt-1.5 text-xs md:text-[13px] font-semibold text-muted-foreground">
            {typeLabel} · {testCount} {testCount === 1 ? "test" : "tests"}
          </p>
        </div>
        {uniformDifficulty && (
          <div className="shrink-0">
            <DifficultyDots difficulty={uniformDifficulty} />
          </div>
        )}
      </div>

      {/* Tests inside the book */}
      <div className="flex flex-col sm:flex-row gap-3">
        {group.tests.map((test) => (
          <LoginRequiredLink
            key={test.id}
            href={`${basePath}/${test.slug}`}
            className="group flex-1 min-w-0 flex flex-col items-start gap-2 text-left border border-border rounded-xl px-4 py-3.5 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="font-bold text-[15px]">{test.testLabel}</span>
              {test.isCompleted && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400 shrink-0">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Completed
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{test.metric}</span>
            <span className="flex items-center gap-0.5 text-xs font-bold text-primary">
              {test.isCompleted ? "Retake" : "Start"}
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </LoginRequiredLink>
        ))}
      </div>
    </div>
  );
}
