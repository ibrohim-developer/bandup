"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EvaluatingBanner({ attemptId }: { attemptId: string }) {
  const [failed, setFailed] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  // Prevents the request from firing twice in dev (Strict Mode runs effects
  // twice). Ref persists across the simulated unmount/remount, so the second
  // pass short-circuits. No `cancelled` flag — if we set one in cleanup, the
  // first pass's resolved fetch would see cancelled=true and skip the reload,
  // leaving the spinner stuck forever.
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/writing/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId }),
        });

        if (res.ok) {
          // Hard reload: router.refresh() doesn't reliably re-render the same
          // URL in App Router, and we need the server component to re-fetch the
          // attempt's new status. A reload guarantees a fresh server render.
          window.location.reload();
        } else {
          setFailed(true);
          inFlightRef.current = false;
        }
      } catch {
        setFailed(true);
        inFlightRef.current = false;
      }
    })();
  }, [attemptId, retryToken]);

  if (failed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <div>
            <h2 className="text-2xl font-bold">Evaluation failed</h2>
            <p className="text-muted-foreground mt-2">
              We couldn&apos;t score one or more of your responses. Your writing
              is saved — please retry.
            </p>
          </div>
          <Button
            onClick={() => {
              setFailed(false);
              setRetryToken((n) => n + 1);
            }}
          >
            Retry evaluation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <Sparkles className="h-12 w-12 text-purple-500" />
          <Loader2 className="h-6 w-6 text-purple-500 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Evaluating your writing...</h2>
          <p className="text-muted-foreground mt-2">
            This usually takes 15-30 seconds. Please wait.
          </p>
        </div>
      </div>
    </div>
  );
}
