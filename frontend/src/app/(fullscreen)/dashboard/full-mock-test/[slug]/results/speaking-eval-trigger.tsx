"use client";

import { useEffect, useRef } from "react";

interface Props {
  attemptId: string;
}

// Mounts only when the speaking attempt is still in `evaluating` (typically
// because the user closed the tab mid-eval and the session PATCH never ran,
// or the server killed the eval before completion). Re-triggers the eval and
// hard-reloads when done. Ref guard prevents Strict Mode double-fire.
export function SpeakingEvalTrigger({ attemptId }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/speaking/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId }),
        });
        if (cancelled || !res.ok) return;
        window.location.reload();
      } catch {
        // surface nothing — the parent results page still renders with
        // whatever scores were already available
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  return null;
}
