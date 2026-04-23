"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Highlighter, StickyNote } from "lucide-react";
import { useWordDefinition } from "@/hooks/use-word-definition";
import { WordDefinitionPopup } from "./word-definition-popup";

interface PopupState {
  x: number;
  y: number;
  mode: "actions" | "remove" | "definition";
}

type MarkType = "highlight" | "note";

interface PassageDisplayProps {
  title: string;
  content: string;
  highlight?: { bg: string; color: string };
  noteHighlight?: { bg: string; color: string };
  onHighlight?: (id: string, text: string) => void;
  onRemoveHighlight?: (id: string) => void;
  onNote?: (markId: string, selectedText: string) => void;
  onNoteMarkClick?: (markId: string) => void;
  cancelNoteMarkId?: string | null;
  onCancelNoteMarkHandled?: () => void;
  disableWordLookup?: boolean;
}

function getTextNodesInRange(range: Range): Text[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(
    range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement!
      : range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT
  );

  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    if (range.intersectsNode(node) && node.textContent?.trim()) {
      textNodes.push(node);
    }
  }
  return textNodes;
}

function wrapRangeWithMark(
  range: Range,
  bgColor: string,
  textColor: string,
  markType: MarkType
): string {
  const id = crypto.randomUUID();

  const createMark = () => {
    const mark = document.createElement("mark");
    mark.dataset.highlightId = id;
    mark.dataset.markType = markType;
    mark.style.backgroundColor = bgColor;
    mark.style.color = textColor;
    mark.style.borderRadius = "2px";
    mark.style.padding = "0 1px";
    mark.style.cursor = "pointer";
    return mark;
  };

  // Simple case: selection within a single text node
  try {
    const mark = createMark();
    range.surroundContents(mark);
    return id;
  } catch {
    // Cross-element selection — wrap each text node individually
  }

  const textNodes = getTextNodesInRange(range);

  for (const textNode of textNodes) {
    const mark = createMark();
    let targetNode: Text = textNode;

    // Split start text node if it's the range start container
    if (textNode === range.startContainer && range.startOffset > 0) {
      targetNode = textNode.splitText(range.startOffset);
    }

    // Split end text node if it's the range end container
    if (
      textNode === range.endContainer ||
      targetNode === range.endContainer
    ) {
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
  const marks = container.querySelectorAll(
    `mark[data-highlight-id="${id}"]`
  );
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    while (mark.firstChild) {
      parent?.insertBefore(mark.firstChild, mark);
    }
    parent?.removeChild(mark);
    parent?.normalize();
  });
}

export function PassageDisplay({
  title,
  content,
  highlight = { bg: "#fef08a", color: "#111827" },
  noteHighlight = { bg: "#bfdbfe", color: "#111827" },
  onHighlight,
  onRemoveHighlight,
  onNote,
  onNoteMarkClick,
  cancelNoteMarkId,
  onCancelNoteMarkHandled,
  disableWordLookup = false,
}: PassageDisplayProps) {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const pendingRangeRef = useRef<Range | null>(null);
  const pendingSelectedTextRef = useRef<string>("");
  const pendingRemoveIdRef = useRef<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [clickedWord, setClickedWord] = useState("");
  const { state: definitionState, lookup: lookupDefinition, reset: resetDefinition } = useWordDefinition();

  const paragraphs = useMemo(() => {
    const parts = content.split(/\r?\n\r?\n/).filter((p) => p.trim());
    const hasSub =
      parts.length > 1 && parts[0].length < 150 && !parts[0].endsWith(".");
    return {
      subtitle: hasSub ? parts[0] : null,
      body: hasSub ? parts.slice(1) : parts,
    };
  }, [content]);

  // Update existing mark styles when contrast theme changes
  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current
      .querySelectorAll('mark[data-mark-type="highlight"]')
      .forEach((mark) => {
        (mark as HTMLElement).style.backgroundColor = highlight.bg;
        (mark as HTMLElement).style.color = highlight.color;
      });
    contentRef.current
      .querySelectorAll('mark[data-mark-type="note"]')
      .forEach((mark) => {
        (mark as HTMLElement).style.backgroundColor = noteHighlight.bg;
        (mark as HTMLElement).style.color = noteHighlight.color;
      });
  }, [highlight.bg, highlight.color, noteHighlight.bg, noteHighlight.color]);

  // Handle cancel note mark from parent
  useEffect(() => {
    if (cancelNoteMarkId && contentRef.current) {
      removeMarkById(contentRef.current, cancelNoteMarkId);
      onCancelNoteMarkHandled?.();
    }
  }, [cancelNoteMarkId, onCancelNoteMarkHandled]);

  const closePopup = useCallback(() => {
    setPopup(null);
    pendingRangeRef.current = null;
    pendingSelectedTextRef.current = "";
    pendingRemoveIdRef.current = null;
    setClickedWord("");
    resetDefinition();
  }, [resetDefinition]);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const markEl = target.closest("mark[data-highlight-id]") as HTMLElement;

      if (markEl) {
        const id = markEl.dataset.highlightId;
        const markType = markEl.dataset.markType;
        if (!id) return;

        // Note mark → open drawer with that note
        if (markType === "note") {
          onNoteMarkClick?.(id);
          return;
        }

        // Highlight mark → show remove popup at click position
        pendingRemoveIdRef.current = id;
        pendingRangeRef.current = null;
        pendingSelectedTextRef.current = "";
        setPopup({
          x: e.clientX,
          y: e.clientY - 8,
          mode: "remove",
        });
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        // Single click — try to look up the word at click position (desktop only)
        if (disableWordLookup || window.innerWidth < 768) return;
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
          const text = range.startContainer.textContent || "";
          const offset = range.startOffset;
          let start = offset;
          let end = offset;
          while (start > 0 && /[a-z']/i.test(text[start - 1])) start--;
          while (end < text.length && /[a-z']/i.test(text[end])) end++;
          const word = text.slice(start, end).replace(/^'+|'+$/g, "");
          if (word.length >= 2) {
            setClickedWord(word);
            lookupDefinition(word);
            setPopup({ x: e.clientX, y: e.clientY - 8, mode: "definition" });
          }
        }
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString().trim();
      if (!selectedText) return;

      if (!contentRef.current?.contains(range.commonAncestorContainer)) return;

      pendingRangeRef.current = range.cloneRange();
      pendingSelectedTextRef.current = selectedText;
      pendingRemoveIdRef.current = null;
      setPopup({
        x: e.clientX,
        y: e.clientY - 8,
        mode: "actions",
      });
    },
    [onNoteMarkClick, lookupDefinition]
  );

  const applyHighlight = useCallback(() => {
    const range = pendingRangeRef.current;
    const text = pendingSelectedTextRef.current;
    if (!range || !contentRef.current) return;

    const id = wrapRangeWithMark(range, highlight.bg, highlight.color, "highlight");
    window.getSelection()?.removeAllRanges();
    onHighlight?.(id, text);
    closePopup();
  }, [highlight.bg, highlight.color, onHighlight, closePopup]);

  const handleNoteClick = useCallback(() => {
    const range = pendingRangeRef.current;
    const text = pendingSelectedTextRef.current;
    if (!range || !text || !contentRef.current) return;

    const markId = wrapRangeWithMark(range, noteHighlight.bg, noteHighlight.color, "note");
    window.getSelection()?.removeAllRanges();
    onNote?.(markId, text);
    closePopup();
  }, [noteHighlight.bg, noteHighlight.color, onNote, closePopup]);

  const removeHighlight = useCallback(() => {
    const id = pendingRemoveIdRef.current;
    if (!id || !contentRef.current) return;

    removeMarkById(contentRef.current, id);
    onRemoveHighlight?.(id);
    closePopup();
  }, [onRemoveHighlight, closePopup]);

  // Close popup on click outside
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
            className="fixed z-50 flex items-center gap-1 rounded-lg shadow-lg overflow-hidden"
            style={{
              left: popup.x,
              top: popup.y,
              transform: "translate(-50%, -100%)",
              backgroundColor: "#1f2937",
            }}
          >
            <button
              onClick={handleNoteClick}
              className="cursor-pointer flex items-center gap-1.5 text-white text-sm font-medium px-3 py-2 hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <StickyNote className="h-3.5 w-3.5" />
              Note
            </button>
            <div className="w-px h-5 bg-white/20" />
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
        ) : popup.mode === "remove" ? (
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
        ) : popup.mode === "definition" ? (
          <div
            ref={popupRef}
            className="fixed z-50"
            style={{
              left: Math.max(170, Math.min(popup.x, window.innerWidth - 170)),
              top: popup.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <WordDefinitionPopup state={definitionState} word={clickedWord} />
          </div>
        ) : null,
        document.body
      )
    : null;

  return (
    <article className="p-3 md:p-8 space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {paragraphs.subtitle && (
        <p className="text-sm italic opacity-70">{paragraphs.subtitle}</p>
      )}
      <div ref={contentRef} className="space-y-4" onMouseUp={handleMouseUp}>
        {paragraphs.body.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed opacity-90">
            {paragraph}
          </p>
        ))}
      </div>
      {popupEl}
    </article>
  );
}