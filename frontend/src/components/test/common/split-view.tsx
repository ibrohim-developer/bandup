"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, ChevronsUpDown } from "lucide-react";

interface SplitViewProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultRatio?: number;
}

export function SplitView({
  leftPanel,
  rightPanel,
  defaultRatio = 50,
}: SplitViewProps) {
  const [ratio, setRatio] = useState(defaultRatio);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();

    if (isMobile) {
      const y = e.clientY - rect.top;
      const newRatio = (y / rect.height) * 100;
      setRatio(Math.max(20, Math.min(80, newRatio)));
    } else {
      const x = e.clientX - rect.left;
      const newRatio = (x / rect.width) * 100;
      setRatio(Math.max(30, Math.min(70, newRatio)));
    }
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();

      if (isMobile) {
        const y = touch.clientY - rect.top;
        const newRatio = (y / rect.height) * 100;
        setRatio(Math.max(20, Math.min(80, newRatio)));
      } else {
        const x = touch.clientX - rect.left;
        const newRatio = (x / rect.width) * 100;
        setRatio(Math.max(30, Math.min(70, newRatio)));
      }
    },
    [isDragging, isMobile],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd, handleMouseUp]);

  if (isMobile) {
    return (
      <div className="flex flex-col h-full" ref={containerRef}>
        <div
          className={cn(
            "flex flex-col flex-1 min-h-0",
            isDragging && "select-none",
          )}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Top Panel */}
          <div
            className="flex flex-col overflow-y-auto "
            style={{ height: `${ratio}%` }}
          >
            <div className="flex-1">{leftPanel}</div>
          </div>

          {/* Horizontal Resizer — line with centered pill icon */}
          <div
            className="relative flex cursor-row-resize items-center justify-center shrink-0 py-3 -my-3 z-10"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
            <div
              className={cn(
                "relative flex items-center justify-center w-10 h-7 rounded-full border bg-background shadow-sm transition-colors",
                isDragging
                  ? "border-muted-foreground/50"
                  : "border-border hover:border-muted-foreground/40",
              )}
            >
              <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Bottom Panel */}
          <div
            className="flex flex-col overflow-y-auto bg-white"
            style={{ height: `${100 - ratio}%` }}
          >
            <div className="flex-1">{rightPanel}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      {/* Panels */}
      <div
        className={cn("flex flex-1 min-h-0 ", isDragging && "select-none")}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Left Panel - Passage */}
        <div
          className={cn("flex flex-col overflow-y-auto border-r border-gray-200")}
          style={{ width: `${ratio}%` }}
        >
          <div className="flex-1">{leftPanel}</div>
        </div>

        {/* Resizer */}
        <div
          className={cn(
            "flex flex-col w-2 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors items-center justify-center",
            isDragging && "bg-gray-300",
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <GripVertical className="h-5 w-3 text-gray-400" />
          <GripVertical className="h-5 w-3 text-gray-400 -mt-2.5" />
        </div>

        {/* Right Panel - Questions */}
        <div
          className={cn("flex flex-col overflow-y-auto")}
          style={{ width: `${100 - ratio}%` }}
        >
          <div className="flex-1">{rightPanel}</div>
        </div>
      </div>
    </div>
  );
}
