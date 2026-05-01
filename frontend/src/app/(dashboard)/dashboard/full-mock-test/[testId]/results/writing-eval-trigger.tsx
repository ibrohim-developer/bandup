"use client";

import { useEffect, useRef } from "react";

interface Props {
  attemptId: string;
}

// Mounts only when the writing attempt is still in `evaluating`. Fires the
// evaluation, awaits it, then hard-reloads so the server component re-fetches
// and the new band score appears. The ref guard prevents Strict Mode
// double-fire (which would double the Gemini cost).
export function WritingEvalTrigger({ attemptId }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/writing/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId }),
        });
        if (cancelled || !res.ok) return;
        window.location.reload();
      } catch {
        // surface nothing — the parent results page will still render with
        // whatever scores were already available
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  return null;
}
