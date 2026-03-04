"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type HighlighterType from "web-highlighter";

interface PopupPosition {
  x: number;
  y: number;
}

type PopupMode = "highlight" | "remove";

interface PassageDisplayProps {
  title: string;
  content: string;
  highlight?: { bg: string; color: string };
}

export function PassageDisplay({ title, content, highlight = { bg: "#fef08a", color: "#111827" } }: PassageDisplayProps) {
  const [popup, setPopup] = useState<PopupPosition | null>(null);
  const [popupMode, setPopupMode] = useState<PopupMode>("highlight");
  const [pendingRange, setPendingRange] = useState<Range | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HighlighterType | null>(null);

  const paragraphs = content.split(/\r?\n\r?\n/).filter((p) => p.trim());
  const hasSubtitle =
    paragraphs.length > 1 &&
    paragraphs[0].length < 150 &&
    !paragraphs[0].endsWith(".");
  const subtitle = hasSubtitle ? paragraphs[0] : null;
  const bodyParagraphs = hasSubtitle ? paragraphs.slice(1) : paragraphs;

  // Initialize web-highlighter scoped to the content area (dynamic import to avoid SSR window access)
  useEffect(() => {
    if (!contentRef.current) return;
    let disposed = false;

    import("web-highlighter").then(({ default: Highlighter }) => {
      if (disposed || !contentRef.current) return;

      const highlighter = new Highlighter({
        $root: contentRef.current,
        wrapTag: "span",
        style: {
          className: "highlight-yellow",
        },
      });

      // Show "Remove" popup when clicking an existing highlight
      highlighter.on(
        Highlighter.event.CLICK,
        ({ id }: { id: string }, _inst: HighlighterType, e: Event) => {
          const mouseEvent = e as MouseEvent;
          const target = mouseEvent.target as HTMLElement;
          const rect = target.getBoundingClientRect();

          setPendingRemoveId(id);
          setPendingRange(null);
          setPopupMode("remove");
          setPopup({
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
          });
        },
      );

      highlighterRef.current = highlighter;
    });

    return () => {
      disposed = true;
      if (highlighterRef.current) {
        highlighterRef.current.dispose();
        highlighterRef.current = null;
      }
    };
  }, []);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    // Make sure selection is within our content area
    if (!contentRef.current?.contains(range.commonAncestorContainer)) return;

    const rect = range.getBoundingClientRect();

    // Check if the selection is entirely within an existing highlight
    const startNode = range.startContainer;
    const startEl =
      startNode.nodeType === Node.TEXT_NODE
        ? startNode.parentElement
        : (startNode as HTMLElement);
    const existingId =
      startEl && highlighterRef.current
        ? highlighterRef.current.getIdByDom(startEl)
        : null;

    if (existingId) {
      // Already highlighted — offer removal instead
      setPendingRemoveId(existingId);
      setPendingRange(null);
      setPopupMode("remove");
    } else {
      setPendingRange(range.cloneRange());
      setPendingRemoveId(null);
      setPopupMode("highlight");
    }

    setPopup({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, []);

  const applyHighlight = useCallback(() => {
    if (!pendingRange || !highlighterRef.current) return;

    highlighterRef.current.fromRange(pendingRange);
    window.getSelection()?.removeAllRanges();
    closePopup();
  }, [pendingRange]);

  const removeHighlight = useCallback(() => {
    if (!pendingRemoveId || !highlighterRef.current) return;

    highlighterRef.current.remove(pendingRemoveId);
    closePopup();
  }, [pendingRemoveId]);

  const closePopup = () => {
    setPopup(null);
    setPendingRange(null);
    setPendingRemoveId(null);
  };

  // Close popup on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    if (popup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [popup]);

  return (
    <article className="p-8 space-y-4">
      <style>{`
        .highlight-yellow {
          background-color: ${highlight.bg} !important;
          color: ${highlight.color} !important;
          border-radius: 2px;
          padding: 0 1px;
          cursor: pointer;
        }
      `}</style>

      <h2 className="text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm italic opacity-70">{subtitle}</p>}
      <div ref={contentRef} className="space-y-4" onMouseUp={handleMouseUp}>
        {bodyParagraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed opacity-90">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Highlight / Remove Popup */}
      {popup && (
        <div
          ref={popupRef}
          className="fixed z-50 flex items-center"
          style={{
            left: popup.x,
            top: popup.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            onClick={
              popupMode === "highlight" ? applyHighlight : removeHighlight
            }
            className={`cursor-pointer text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-lg transition-colors whitespace-nowrap ${
              popupMode === "remove"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {popupMode === "highlight" ? "Highlight" : "Remove highlight"}
          </button>
          {/* Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
            style={{
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `6px solid ${popupMode === "remove" ? "rgb(220, 38, 38)" : "rgb(17, 24, 39)"}`,
            }}
          />
        </div>
      )}
    </article>
  );
}
