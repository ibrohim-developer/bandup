"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  attemptId: string;
}

// Mounts only when the writing attempt is still in `evaluating`. Fires the
// evaluation once, then polls for completion and refreshes the page so the
// updated band score (and overall) appear without a manual reload.
export function WritingEvalTrigger({ attemptId }: Props) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    fetch("/api/writing/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId }),
    }).catch(() => { });

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/writing/status?attemptId=${attemptId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "completed") {
          clearInterval(interval);
          router.refresh();
        }
      } catch { }
    }, 4000);

    return () => clearInterval(interval);
  }, [attemptId, router]);

  return null;
}
