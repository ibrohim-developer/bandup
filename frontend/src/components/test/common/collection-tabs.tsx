"use client";

import { Suspense, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface CollectionTabsProps {
  counts: { cambridge: number; practice: number };
}

const TABS = [
  { key: "cambridge", label: "Cambridge" },
  { key: "practice", label: "Practice Tests" },
] as const;

function CollectionTabsContent({ counts }: CollectionTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active =
    searchParams.get("tab") === "practice" ? "practice" : "cambridge";

  const selectTab = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "cambridge") {
        params.delete("tab");
      } else {
        params.set("tab", key);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex gap-5 md:gap-8 border-b border-border overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => selectTab(tab.key)}
            className={`relative flex flex-1 justify-center md:flex-initial md:justify-start items-center gap-2 whitespace-nowrap pb-3 -mb-px border-b-2 text-base md:text-lg font-bold transition-colors ${
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function CollectionTabs(props: CollectionTabsProps) {
  return (
    <Suspense fallback={<div className="h-11 w-full border-b border-border" />}>
      <CollectionTabsContent {...props} />
    </Suspense>
  );
}
