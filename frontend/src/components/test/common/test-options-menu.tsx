"use client";

import {
  Menu,
  X,
  ArrowLeft,
  ChevronRight,
  Check,
  Contrast,
  Type,
} from "lucide-react";
import type { ContrastMode, TextSizeMode } from "@/hooks/use-test-options";

interface TestOptionsMenuProps {
  optionsOpen: boolean;
  optionsView: "main" | "contrast" | "textSize";
  setOptionsView: (view: "main" | "contrast" | "textSize") => void;
  contrast: ContrastMode;
  setContrast: (mode: ContrastMode) => void;
  textSize: TextSizeMode;
  setTextSize: (size: TextSizeMode) => void;
  optionsRef: React.RefObject<HTMLDivElement | null>;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  toggleOptions: () => void;
  closeOptions: () => void;
}

export function TestOptionsMenu({
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
}: TestOptionsMenuProps) {
  return (
    <div className="relative">
      <button
        ref={menuButtonRef}
        onClick={toggleOptions}
        className="p-1.5 md:p-2 transition-opacity opacity-70 hover:opacity-100"
      >
        <Menu className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {optionsOpen && (
        <div
          ref={optionsRef}
          className="absolute right-0 top-full mt-2 w-56 md:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
        >
          {optionsView === "main" && (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-900">Options</span>
                <button
                  onClick={closeOptions}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div>
                <button
                  onClick={() => setOptionsView("contrast")}
                  className="w-full flex items-center gap-3 px-3 md:px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Contrast className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-900 flex-1 text-left">
                    Contrast
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                <button
                  onClick={() => setOptionsView("textSize")}
                  className="w-full flex items-center gap-3 px-3 md:px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Type className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-900 flex-1 text-left">
                    Text size
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </>
          )}

          {optionsView === "contrast" && (
            <>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                <button
                  onClick={() => setOptionsView("main")}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-gray-500">Options</span>
                <span className="font-semibold text-gray-900">Contrast</span>
                <button
                  onClick={closeOptions}
                  className="ml-auto p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div>
                {(
                  [
                    { value: "black-on-white", label: "Black on white" },
                    { value: "white-on-black", label: "White on black" },
                    { value: "yellow-on-black", label: "Yellow on black" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setContrast(option.value)}
                    className="w-full flex items-center justify-between px-3 md:px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-900">{option.label}</span>
                    {contrast === option.value && (
                      <Check className="h-4 w-4 text-gray-900" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {optionsView === "textSize" && (
            <>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                <button
                  onClick={() => setOptionsView("main")}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-gray-500">Options</span>
                <span className="font-semibold text-gray-900">Text size</span>
                <button
                  onClick={closeOptions}
                  className="ml-auto p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div>
                {(
                  [
                    { value: "regular", label: "Regular" },
                    { value: "large", label: "Large" },
                    { value: "extra-large", label: "Extra large" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTextSize(option.value)}
                    className="w-full flex items-center justify-between px-3 md:px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-900">{option.label}</span>
                    {textSize === option.value && (
                      <Check className="h-4 w-4 text-gray-900" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
