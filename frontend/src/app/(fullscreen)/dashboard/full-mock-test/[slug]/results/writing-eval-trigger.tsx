"use client";

import { useEffect, useRef, useState } from "react";
import { QuotaPaywallCard } from "@/components/ai-quota-indicator";

interface Props {
  attemptId: string;
}

// Mounts only when the writing attempt is still in `evaluating`. Fires the
// evaluation, awaits it, then hard-reloads so the server component re-fetches
// and the new band score appears. The ref guard prevents Strict Mode
// double-fire (which would double the Gemini cost). If the quota blocks the
// evaluation (402), renders an upgrade prompt instead of scores.
export function WritingEvalTrigger({ attemptId }: Props) {
  const fired = useRef(false);
  const [quotaMessage, setQuotaMessage] = useState<string | null>(null);

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
        if (cancelled) return;
        if (res.status === 402) {
          const data = await res.json().catch(() => null);
          setQuotaMessage(data?.error ?? "Not enough energy for an AI evaluation.");
          return;
        }
        if (!res.ok) return;
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

  if (quotaMessage) {
    return (
      <div className="mb-6">
        <QuotaPaywallCard
          title="Writing score locked"
          message={`${quotaMessage} Your essays are saved — the score appears once you upgrade or your energy refills.`}
        />
      </div>
    );
  }

  return null;
}
