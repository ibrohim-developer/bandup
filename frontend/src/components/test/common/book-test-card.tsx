"use client";

import { useState } from "react";
import { CheckCircle, ChevronRight, ChevronDown } from "lucide-react";
import { LoginRequiredLink } from "@/components/auth/login-required-link";
import { cn } from "@/lib/utils";
import type { BookGroup } from "@/lib/tests/book-grouping";

/**
 * Renders one "book" of module tests. A book with several tests shows them as
 * tiles inside a grouped card; a book with a single test (or a standalone test
 * that doesn't fit the "<Book> Test N" pattern) renders as a flat card.
 *
 * On mobile the grouped card is a collapsible accordion (tap the header to
 * expand/collapse) to cut down on endless scrolling; on `md+` it always shows
 * the test tiles. `defaultOpen` controls the initial mobile state — list pages
 * pass `true` for the first book and `false` for the rest.
 *
 * `basePath` is the module route the tests link to, e.g. "/dashboard/reading".
 */
export function BookTestCard({
  group,
  basePath,
  collapseSingle = true,
  defaultOpen = true,
}: {
  group: BookGroup;
  basePath: string;
  /** When true, a group with one test renders as a flat card. */
  collapseSingle?: boolean;
  /** Initial expanded state of the accordion on mobile. */
  defaultOpen?: boolean;
}) {
  const typeLabel = group.type.charAt(0).toUpperCase() + group.type.slice(1);
  const testCount = group.tests.length;
  const [open, setOpen] = useState(defaultOpen);

  if (collapseSingle && testCount === 1) {
    const test = group.tests[0];
    return (
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 flex flex-row items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-bold tracking-tight truncate">
              {test.title}
            </h3>
            {test.isCompleted && (
              <span className="flex items-center gap-1 text-sm font-bold text-green-600 dark:text-green-400 shrink-0">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Completed</span>
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm md:text-base font-semibold text-muted-foreground">
            {typeLabel}
            {test.metric ? ` · ${test.metric}` : ""}
          </p>
        </div>
        <LoginRequiredLink
          href={`${basePath}/${test.slug}`}
          className="shrink-0 flex items-center gap-0.5 font-bold text-base text-primary hover:opacity-80 transition-all md:gap-1 md:text-primary-foreground md:bg-primary md:px-6 md:py-2.5 md:rounded-xl md:hover:opacity-90"
        >
          {test.isCompleted ? "Retake" : "Start"}
          <ChevronRight className="h-5 w-5 md:h-4 md:w-4" />
        </LoginRequiredLink>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Book header — tap to toggle on mobile, static on md+ */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 text-left p-5 md:p-6 md:cursor-default md:pointer-events-none"
      >
        <div className="min-w-0">
          <h3 className="text-xl md:text-[22px] font-extrabold tracking-tight truncate">
            {group.bookTitle}
          </h3>
          <p className="mt-1.5 text-sm md:text-base font-semibold text-muted-foreground">
            {typeLabel} · {testCount}{" "}
            {testCount === 1 ? group.memberNoun : `${group.memberNoun}s`}
          </p>
        </div>
        <span className="md:hidden shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground">
          <ChevronDown
            className={cn("h-5 w-5 transition-transform", open && "rotate-180")}
          />
        </span>
      </button>

      {/* Tests inside the book — collapsible on mobile, always shown on md+ */}
      <div className={cn("md:block", open ? "block" : "hidden")}>
        {/* Mobile: rows separated by divider lines */}
        <div className="md:hidden border-t border-border divide-y divide-border px-5">
          {group.tests.map((test) => (
            <LoginRequiredLink
              key={test.id}
              href={`${basePath}/${test.slug}`}
              className="w-full flex items-center justify-between gap-3 py-4 text-left"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
                  <span className="truncate">{test.testLabel}</span>
                  {test.isCompleted && (
                    <CheckCircle
                      aria-label="Completed"
                      className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400"
                    />
                  )}
                </span>
                {test.metric && (
                  <span className="mt-0.5 block text-base text-muted-foreground">
                    {test.metric}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-0.5 shrink-0 font-bold text-base text-primary">
                {test.isCompleted ? "Retake" : "Start"}
                <ChevronRight className="h-5 w-5" />
              </span>
            </LoginRequiredLink>
          ))}
        </div>

        {/* md+: test tiles */}
        <div className="hidden md:flex md:flex-row gap-3 px-6 pb-6">
          {group.tests.map((test) => (
            <LoginRequiredLink
              key={test.id}
              href={`${basePath}/${test.slug}`}
              className="group relative md:flex-1 min-w-0 flex flex-col items-start gap-2 text-left border border-border rounded-xl px-4 py-3.5 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {test.isCompleted && (
                <CheckCircle
                  aria-label="Completed"
                  className="absolute top-3 right-3 h-4 w-4 text-green-600 dark:text-green-400"
                />
              )}
              <span className="font-bold text-base md:text-lg whitespace-nowrap">
                {test.testLabel}
              </span>
              {test.metric && (
                <span className="text-sm text-muted-foreground">
                  {test.metric}
                </span>
              )}
              <span className="flex items-center gap-0.5 text-sm font-bold text-primary">
                {test.isCompleted ? "Retake" : "Start"}
                <ChevronRight className="h-4 w-4" />
              </span>
            </LoginRequiredLink>
          ))}
        </div>
      </div>
    </div>
  );
}
