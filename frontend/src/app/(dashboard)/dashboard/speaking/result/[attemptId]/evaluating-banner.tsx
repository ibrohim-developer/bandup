"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mic } from "lucide-react";

export function SpeakingEvaluatingBanner({
  attemptId,
}: {
  attemptId: string;
}) {
  const router = useRouter();
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    fetch("/api/speaking/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId }),
    }).then(() => {
      router.refresh();
    });
  }, [attemptId, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <Mic className="h-12 w-12 text-orange-500" />
          <Loader2 className="h-6 w-6 text-orange-500 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Evaluating your speaking...</h2>
          <p className="text-muted-foreground mt-2">
            This usually takes 30-60 seconds. Please wait.
          </p>
        </div>
      </div>
    </div>
  );
}
