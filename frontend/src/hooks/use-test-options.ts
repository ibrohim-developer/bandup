"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export type ContrastMode = "black-on-white" | "white-on-black" | "yellow-on-black";
export type TextSizeMode = "regular" | "large" | "extra-large";
type OptionsView = "main" | "contrast" | "textSize";

export const contrastThemes: Record<
  ContrastMode,
  { bg: string; bgAlt: string; text: string; textMuted: string; border: string; highlight: { bg: string; color: string } }
> = {
  "black-on-white": { bg: "#ffffff", bgAlt: "#f3f4f6", text: "#111827", textMuted: "#6b7280", border: "#e5e7eb", highlight: { bg: "#fef08a", color: "#111827" } },
  "white-on-black": { bg: "#0a0a0a", bgAlt: "#1a1a1a", text: "#ffffff", textMuted: "#a3a3a3", border: "#333333", highlight: { bg: "#60a5fa", color: "#111827" } },
  "yellow-on-black": { bg: "#0a0a0a", bgAlt: "#1a1a1a", text: "#fde047", textMuted: "#d4b800", border: "#333333", highlight: { bg: "#4ade80", color: "#111827" } },
};

export const textSizeScale: Record<TextSizeMode, string> = {
  regular: "1",
  large: "1.15",
  "extra-large": "1.35",
};

export function useTestOptions() {
  const { theme: dashboardTheme } = useTheme();
  const initialContrast: ContrastMode = dashboardTheme === "dark" ? "white-on-black" : "black-on-white";

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsView, setOptionsView] = useState<OptionsView>("main");
  const [contrast, setContrast] = useState<ContrastMode>(initialContrast);
  const [textSize, setTextSize] = useState<TextSizeMode>("regular");
  const optionsRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!optionsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setOptionsOpen(false);
        setOptionsView("main");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [optionsOpen]);

  const theme = contrastThemes[contrast];
  const scale = textSizeScale[textSize];

  const toggleOptions = () => {
    setOptionsOpen(!optionsOpen);
    setOptionsView("main");
  };

  const closeOptions = () => {
    setOptionsOpen(false);
    setOptionsView("main");
  };

  const rootStyle = {
    backgroundColor: theme.bg,
    color: theme.text,
    zoom: scale,
    height: `calc(100vh / ${scale})`,
  } as React.CSSProperties;

  return {
    theme,
    scale,
    rootStyle,
    optionsOpen,
    optionsView,
    setOptionsView,
    contrast,
    setContrast,
    textSize,
    setTextSize,
    optionsRef,
    menuButtonRef,
    toggleOptions,
    closeOptions,
  };
}
