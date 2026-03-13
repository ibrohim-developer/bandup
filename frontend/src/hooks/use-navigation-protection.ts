"use client";

import { useEffect } from "react";

export function useNavigationProtection({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    // Push a dummy state so popstate fires when browser back is pressed
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Re-push state to keep the user on the page
      window.history.pushState(null, "", window.location.href);
      window.confirm(
        "If you leave this page, all your answers will be lost and your test progress will not be saved.",
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled]);
}
