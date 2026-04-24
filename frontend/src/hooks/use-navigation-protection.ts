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

    // Push a sentinel entry so the first back press lands on it instead of
    // navigating away. When popstate fires we re-push so the user stays put,
    // then show a native confirm. On confirm, run the consumer's nav callback.
    const sentinelState = { __examGuard: true, ts: Date.now() };
    window.history.pushState(sentinelState, "");

    const handlePopState = () => {
      window.history.pushState(sentinelState, "");
      if (window.confirm(confirmMessage)) {
        onBackAttempt?.();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled, confirmMessage, onBackAttempt]);
}
