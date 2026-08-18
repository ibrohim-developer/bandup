"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";
import {
  PRACTICE_QUOTA_QUERY_KEY,
  type PracticeQuotaPayload,
} from "@/hooks/use-practice-quota";
import { PracticeRunner, type SessionPrompt } from "./practice-runner";

type StartState =
  | { status: "starting" }
  | { status: "active"; sessionId: string; prompt: SessionPrompt; quota: PracticeQuotaPayload }
  | { status: "error"; message: string }
  | { status: "quota"; message: string };

/**
 * Starts a practice session for one topic, then hands off to the runner. Lives
 * on its own route (/dashboard/practice/[promptId]) so each topic is a real
 * page — the browser Back button returns to the picker and topic URLs are
 * shareable, instead of the whole flow being one in-place state swap.
 */
export function PracticeSession({ promptId }: { promptId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, setState] = useState<StartState>({ status: "starting" });
  // The session POST is a mutation — guard the StrictMode double-mount so we
  // create exactly one session per visit.
  const startedRef = useRef(false);
  // Latest active session id + a fired-once guard, read by the leave handler
  // without making it depend on render state.
  const sessionIdRef = useRef<string | null>(null);
  const endedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void (async () => {
      try {
        const res = await fetch("/api/practice/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptId }),
        });
        const body = await res.json();
        if (res.status === 402) {
          setState({
            status: "quota",
            message:
              body.error ??
              "You've used today's practice time. It refills on a rolling 24-hour window.",
          });
          return;
        }
        if (!res.ok) {
          setState({ status: "error", message: body.error ?? "Couldn't start the session." });
          return;
        }
        sessionIdRef.current = body.sessionId;
        setState({
          status: "active",
          sessionId: body.sessionId,
          prompt: body.prompt,
          quota: body.quota,
        });
      } catch {
        setState({
          status: "error",
          message: "Couldn't start the session. Check your connection.",
        });
      }
    })();
  }, [promptId]);

  // End the session whenever the learner leaves this page without it already
  // being ended — Back button, an in-app nav, or closing the tab. Without this,
  // walking away leaves the row "active" until the next session start abandons
  // it. The PATCH is idempotent server-side (no-op once status !== "active")
  // and endedRef fires it at most once; `keepalive` lets it survive unload.
  useEffect(() => {
    const endSession = () => {
      const id = sessionIdRef.current;
      if (!id || endedRef.current) return;
      endedRef.current = true;
      fetch("/api/practice/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id }),
        keepalive: true,
      }).catch(() => {});
    };
    window.addEventListener("pagehide", endSession);
    return () => {
      window.removeEventListener("pagehide", endSession);
      endSession();
    };
  }, []);

  const handleEnd = () => {
    // The runner already PATCHed the session before showing its summary, so
    // skip the leave handler's redundant end.
    endedRef.current = true;
    queryClient.invalidateQueries({ queryKey: PRACTICE_QUOTA_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["practice-prompts"] });
    router.push("/dashboard/practice");
  };

  if (state.status === "starting") {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (state.status === "active") {
    return (
      <PracticeRunner
        sessionId={state.sessionId}
        prompt={state.prompt}
        initialQuota={state.quota}
        onEnd={handleEnd}
      />
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground">{state.message}</p>
      {state.status === "quota" && (
        <PremiumUpgradeDialog
          variant="energy"
          trigger={<Button className="w-full">Get more practice time</Button>}
        />
      )}
      <Button asChild variant={state.status === "quota" ? "ghost" : "default"} className="w-full">
        <Link href="/dashboard/practice">Back to topics</Link>
      </Button>
    </div>
  );
}
