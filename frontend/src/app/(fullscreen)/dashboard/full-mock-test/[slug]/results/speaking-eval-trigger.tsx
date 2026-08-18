"use client";

import { useEffect, useRef, useState } from "react";
import { QuotaPaywallCard } from "@/components/ai-quota-indicator";

interface Props {
  attemptId: string;
}

// Mounts only when the speaking attempt is still in `evaluating` (typically
// because the user closed the tab mid-eval and the session PATCH never ran,
// or the server killed the eval before completion). Re-triggers the eval and
// hard-reloads when done. Ref guard prevents Strict Mode double-fire. If the
// quota blocks the evaluation (402), renders an upgrade prompt instead.
export function SpeakingEvalTrigger({ attemptId }: Props) {
  const fired = useRef(false);
  const [quotaMessage, setQuotaMessage] = useState<string | null>(null);

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
        if (cancelled) return;
        if (res.status === 402) {
          const data = await res.json().catch(() => null);
          setQuotaMessage(data?.error ?? "Not enough energy for an AI evaluation.");
          return;
        }
        if (!res.ok) return;
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

  if (quotaMessage) {
    return (
      <div className="mb-6">
        <QuotaPaywallCard
          title="Speaking score locked"
          message={`${quotaMessage} Your recordings are saved — the score appears once you upgrade or your energy refills.`}
        />
      </div>
    );
  }

  return null;
}
