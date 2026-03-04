"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, GripHorizontal } from "lucide-react";

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
            className="overflow-y-auto border-b border-gray-200"
            style={{ height: `${ratio}%` }}
          >
            {leftPanel}
          </div>

          {/* Horizontal Resizer */}
          <div
            className={cn(
              "flex h-1.5 bg-gray-200 cursor-row-resize hover:bg-gray-400 transition-colors items-center justify-center shrink-0",
              isDragging && "bg-gray-300",
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <GripHorizontal className="w-5 h-3 text-gray-400" />
            <GripHorizontal className="w-5 h-3 text-gray-400 -ml-2.5" />
          </div>

          {/* Bottom Panel */}
          <div
            className="overflow-y-auto bg-white"
            style={{ height: `${100 - ratio}%` }}
          >
            {rightPanel}
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
          className={cn("overflow-y-auto border-r border-gray-200")}
          style={{ width: `${ratio}%` }}
        >
          {leftPanel}
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
          className={cn("overflow-y-auto bg-white")}
          style={{ width: `${100 - ratio}%` }}
        >
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
