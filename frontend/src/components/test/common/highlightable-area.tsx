"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Highlighter } from "lucide-react";

interface PopupState {
  x: number;
  y: number;
  mode: "actions" | "remove";
}

interface HighlightableAreaProps {
  children: React.ReactNode;
  highlight?: { bg: string; color: string };
  className?: string;
}

function getTextNodesInRange(range: Range): Text[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(
    range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement!
      : range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
  );

  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    if (range.intersectsNode(node) && node.textContent?.trim()) {
      textNodes.push(node);
    }
  }
  return textNodes;
}

function wrapRangeWithMark(range: Range, bgColor: string, textColor: string): string {
  const id = crypto.randomUUID();

  const createMark = () => {
    const mark = document.createElement("mark");
    mark.dataset.highlightId = id;
    mark.dataset.markType = "highlight";
    mark.style.backgroundColor = bgColor;
    mark.style.color = textColor;
    mark.style.borderRadius = "2px";
    mark.style.padding = "0 1px";
    mark.style.cursor = "pointer";
    return mark;
  };

  try {
    const mark = createMark();
    range.surroundContents(mark);
    return id;
  } catch {
    // cross-element selection — wrap each text node individually
  }

  const textNodes = getTextNodesInRange(range);

  for (const textNode of textNodes) {
    const mark = createMark();
    let targetNode: Text = textNode;

    if (textNode === range.startContainer && range.startOffset > 0) {
      targetNode = textNode.splitText(range.startOffset);
    }

    if (textNode === range.endContainer || targetNode === range.endContainer) {
      const offset =
        targetNode === range.endContainer
          ? range.endOffset
          : range.endOffset - (textNode.length - targetNode.length);
      if (offset > 0 && offset < targetNode.length) {
        targetNode.splitText(offset);
      }
    }

    targetNode.parentNode?.insertBefore(mark, targetNode);
    mark.appendChild(targetNode);
  }

  return id;
}

function removeMarkById(container: HTMLElement, id: string) {
  const marks = container.querySelectorAll(`mark[data-highlight-id="${id}"]`);
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    while (mark.firstChild) {
      parent?.insertBefore(mark.firstChild, mark);
    }
    parent?.removeChild(mark);
    parent?.normalize();
  });
}

const INTERACTIVE_SELECTOR = "input, textarea, select, button, label, [contenteditable], [role='radio'], [role='checkbox']";

export function HighlightableArea({
  children,
  highlight = { bg: "#fef08a", color: "#111827" },
  className,
}: HighlightableAreaProps) {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const pendingRangeRef = useRef<Range | null>(null);
  const pendingRemoveIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current
      .querySelectorAll('mark[data-mark-type="highlight"]')
      .forEach((mark) => {
        (mark as HTMLElement).style.backgroundColor = highlight.bg;
        (mark as HTMLElement).style.color = highlight.color;
      });
  }, [highlight.bg, highlight.color]);

  const closePopup = useCallback(() => {
    setPopup(null);
    pendingRangeRef.current = null;
    pendingRemoveIdRef.current = null;
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Click on existing highlight mark → show remove popup
    const markEl = target.closest("mark[data-highlight-id]") as HTMLElement | null;
    if (markEl) {
      const id = markEl.dataset.highlightId;
      if (!id) return;
      pendingRemoveIdRef.current = id;
      pendingRangeRef.current = null;
      setPopup({ x: e.clientX, y: e.clientY - 8, mode: "remove" });
      return;
    }

    // Ignore selections that start inside interactive form elements
    if (target.closest(INTERACTIVE_SELECTOR)) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    if (!containerRef.current?.contains(range.commonAncestorContainer)) return;

    pendingRangeRef.current = range.cloneRange();
    pendingRemoveIdRef.current = null;
    setPopup({ x: e.clientX, y: e.clientY - 8, mode: "actions" });
  }, []);

  const applyHighlight = useCallback(() => {
    const range = pendingRangeRef.current;
    if (!range || !containerRef.current) return;

    wrapRangeWithMark(range, highlight.bg, highlight.color);
    window.getSelection()?.removeAllRanges();
    closePopup();
  }, [highlight.bg, highlight.color, closePopup]);

  const removeHighlight = useCallback(() => {
    const id = pendingRemoveIdRef.current;
    if (!id || !containerRef.current) return;

    removeMarkById(containerRef.current, id);
    closePopup();
  }, [closePopup]);

  useEffect(() => {
    if (!popup) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popup, closePopup]);

  const popupEl = popup
    ? createPortal(
        popup.mode === "actions" ? (
          <div
            ref={popupRef}
            className="fixed z-50 flex items-center rounded-lg shadow-lg overflow-hidden"
            style={{
              left: popup.x,
              top: popup.y,
              transform: "translate(-50%, -100%)",
              backgroundColor: "#1f2937",
            }}
          >
            <button
              onClick={applyHighlight}
              className="cursor-pointer flex items-center gap-1.5 text-white text-sm font-medium px-3 py-2 hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <Highlighter className="h-3.5 w-3.5" />
              Highlight
            </button>
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #1f2937",
              }}
            />
          </div>
        ) : (
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
              onClick={removeHighlight}
              className="cursor-pointer text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-lg transition-colors whitespace-nowrap bg-red-600 hover:bg-red-700"
            >
              Remove highlight
            </button>
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid rgb(220, 38, 38)",
              }}
            />
          </div>
        ),
        document.body,
      )
    : null;

  return (
    <div ref={containerRef} onMouseUp={handleMouseUp} className={className}>
      {children}
      {popupEl}
    </div>
  );
}
