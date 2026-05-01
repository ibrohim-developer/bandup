"use client";

import { useEffect, useRef, useState } from "react";
import { Flag } from "lucide-react";
import { ReportIssueDialog } from "@/components/report-issue-dialog";

interface TestContextMenuProps {
  module?: string;
}

export function TestContextMenu({ module }: TestContextMenuProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      e.preventDefault();
      // Keep menu inside viewport (menu is ~160px wide, ~44px tall)
      const x = Math.min(e.clientX, window.innerWidth - 168);
      const y = Math.min(e.clientY, window.innerHeight - 52);
      setPos({ x, y });
    }

    function onDismiss(e: MouseEvent | KeyboardEvent) {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (
        e instanceof MouseEvent &&
        menuRef.current?.contains(e.target as Node)
      )
        return;
      setPos(null);
    }

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("click", onDismiss);
    document.addEventListener("keydown", onDismiss);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("click", onDismiss);
      document.removeEventListener("keydown", onDismiss);
    };
  }, []);

  return (
    <>
      {pos && (
        <div
          ref={menuRef}
          style={{ top: pos.y, left: pos.x }}
          className="fixed z-[9999] min-w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <button
            onClick={() => {
              setPos(null);
              setReportOpen(true);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Flag className="h-4 w-4 shrink-0" />
            Report an issue
          </button>
        </div>
      )}

      <ReportIssueDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        module={module}
      />
    </>
  );
}
