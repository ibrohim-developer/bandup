"use client";

import { useEffect } from "react";

interface Options {
  enabled: boolean;
  /** Shown in the native confirm when the user hits the browser back button. */
  confirmMessage?: string;
  /** Called only if the user confirms leaving. Should perform the actual nav. */
  onBackAttempt?: () => void;
}

const DEFAULT_MESSAGE =
  "If you leave this page, your answers will be lost and your test progress will not be saved.";

export function useNavigationProtection({
  enabled,
  confirmMessage = DEFAULT_MESSAGE,
  onBackAttempt,
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Push a sentinel entry so the first browser-back press lands on it
    // instead of leaving the page. When popstate fires, the browser has
    // already popped past the sentinel and we are back on the real page —
    // from there we either re-arm the trap (cancel) or step back once more
    // to actually leave (confirm).
    const sentinelState = { __examGuard: true, ts: Date.now() };
    window.history.pushState(sentinelState, "");

    const handlePopState = () => {
      if (window.confirm(confirmMessage)) {
        // Remove listeners before navigating so they don't re-trigger.
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
        if (onBackAttempt) {
          onBackAttempt();
        } else {
          // We're already one step back (on the real page). One more goes past it.
          window.history.back();
        }
      } else {
        // Re-arm: push the sentinel again so the next back press is also caught.
        window.history.pushState(sentinelState, "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled, confirmMessage, onBackAttempt]);
}
