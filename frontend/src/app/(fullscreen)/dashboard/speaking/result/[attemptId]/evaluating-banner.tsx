"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mic } from "lucide-react";
import { QuotaPaywallCard } from "@/components/ai-quota-indicator";

export function SpeakingEvaluatingBanner({
  attemptId,
}: {
  attemptId: string;
}) {
  const router = useRouter();
  const didFetch = useRef(false);
  const [quotaMessage, setQuotaMessage] = useState<string | null>(null);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    (async () => {
      const res = await fetch("/api/speaking/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      }).catch(() => null);

      if (res?.status === 402) {
        // Quota hit — recordings are saved; evaluation resumes after an
        // upgrade or when the weekly window resets.
        const data = await res.json().catch(() => null);
        setQuotaMessage(data?.error ?? "Not enough energy for an AI evaluation.");
        return;
      }
      router.refresh();
    })();
  }, [attemptId, router]);

  if (quotaMessage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <QuotaPaywallCard
            message={`${quotaMessage} Your recordings are saved — evaluation will run once you upgrade or your energy refills.`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
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
