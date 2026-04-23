"use client";

import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";

const WEEKS = 52;
const DAYS = 7; // Mon–Sun
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const levelClass = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/70",
  "bg-primary",
];

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function buildGrid(activityMap: Record<string, number>) {
  // End = today, start = 52 weeks ago (Monday-aligned)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Go back to the most recent Monday 52 weeks ago
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - WEEKS * 7 - ((today.getDay() + 6) % 7));

  const weeks: { date: string; count: number; isFuture: boolean }[][] = [];

  for (let w = 0; w < WEEKS + 1; w++) {
    const week: { date: string; count: number; isFuture: boolean }[] = [];
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + w * 7 + d);
      const iso = toISO(date);
      week.push({
        date: iso,
        count: activityMap[iso] ?? 0,
        isFuture: date > today,
      });
    }
    weeks.push(week);
  }

  return weeks;
}

function getMonthLabels(weeks: { date: string }[][]) {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = "";
  weeks.forEach((week, i) => {
    const month = new Date(week[0].date).toLocaleDateString("en-US", { month: "short" });
    if (month !== lastMonth) {
      labels.push({ label: month, col: i });
      lastMonth = month;
    }
  });
  return labels;
}

interface Props {
  activityMap: Record<string, number>;
  totalActive: number;
}

export function ActivityHeatmap({ activityMap, totalActive }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const weeks = buildGrid(activityMap);
  const monthLabels = getMonthLabels(weeks);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-sm">Activity</h3>
        <span className="text-xs text-muted-foreground font-bold">
          {totalActive} active day{totalActive !== 1 ? "s" : ""} in the last year
        </span>
      </div>

      {/* Single CSS grid: label col + 1fr per week, auto month row + 7 day rows */}
      <div
        className="grid gap-0.5 w-full"
        style={{ gridTemplateColumns: `2rem repeat(${weeks.length}, minmax(0, 1fr))` }}
      >
        {/* Row 0: month labels */}
        <div />
        {weeks.map((_, i) => {
          const label = monthLabels.find((m) => m.col === i);
          return (
            <div key={i} className="text-[9px] text-muted-foreground font-bold overflow-visible whitespace-nowrap pb-0.5">
              {label?.label ?? ""}
            </div>
          );
        })}

        {/* Rows 1–7: day label + one cell per week */}
        {DAY_LABELS.map((dayLabel, d) =>
          <Fragment key={d}>
            <div className="text-[9px] text-muted-foreground font-bold flex items-center">
              {dayLabel}
            </div>
            {weeks.map((week, w) => {
              const cell = week[d];
              return (
                <div
                  key={w}
                  className={cn(
                    "aspect-square rounded-[2px] transition-opacity cursor-default",
                    cell.isFuture
                      ? "opacity-0 pointer-events-none"
                      : levelClass[getLevel(cell.count)],
                  )}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    const dateLabel = new Date(cell.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                    setTooltip({
                      text: cell.count === 0
                        ? `No activity on ${dateLabel}`
                        : `${cell.count} session${cell.count > 1 ? "s" : ""} on ${dateLabel}`,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </Fragment>
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 bg-popover text-popover-foreground border border-border rounded-lg text-xs font-bold shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full -mt-1"
          style={{ left: tooltip.x, top: tooltip.y - 6 }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={cn("w-2.5 h-2.5 rounded-[2px]", levelClass[l as 0 | 1 | 2 | 3 | 4])} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
