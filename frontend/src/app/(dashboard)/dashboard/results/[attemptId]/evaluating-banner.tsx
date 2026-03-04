"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

export function EvaluatingBanner({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    fetch("/api/writing/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId }),
    }).then(() => {
      router.refresh();
    });
  }, [attemptId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <Sparkles className="h-12 w-12 text-purple-500" />
          <Loader2 className="h-6 w-6 text-purple-500 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            Evaluating your writing...
          </h2>
          <p className="text-muted-foreground mt-2">
            This usually takes 15-30 seconds. Please wait.
          </p>
        </div>
      </div>
    </div>
  );
}
