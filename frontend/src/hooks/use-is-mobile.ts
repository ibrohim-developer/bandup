"use client";

import { useSyncExternalStore } from "react";

/** Tailwind's `md` breakpoint is 768px, so "mobile" is anything below it. */
const QUERY = "(max-width: 767px)";

let mediaQueryList: MediaQueryList | null = null;
function getMediaQueryList() {
  if (!mediaQueryList) mediaQueryList = window.matchMedia(QUERY);
  return mediaQueryList;
}

function subscribe(onChange: () => void) {
  const mql = getMediaQueryList();
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * True when the viewport is below the `md` breakpoint.
 *
 * Uses `useSyncExternalStore` — React's built-in for subscribing to an external
 * source like `matchMedia` — rather than `useState` + `useEffect`. It avoids the
 * extra mount render (and the resulting flash) and stays consistent across
 * concurrent renders. On the server it reports `false` (desktop-first) and
 * resolves to the real value on hydration.
 */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => getMediaQueryList().matches,
    () => false,
  );
}
