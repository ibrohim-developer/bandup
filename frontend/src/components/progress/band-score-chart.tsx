"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { AttemptPoint } from "@/app/(dashboard)/dashboard/progress/actions";

const FILTERS = [
  { key: "all", label: "All Skills" },
  { key: "reading", label: "Reading" },
  { key: "listening", label: "Listening" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
] as const;

const BAND_SCORE_MODULES = new Set(["writing", "speaking"]);

const moduleColor: Record<string, string> = {
  reading: "#8b5cf6",
  listening: "#3b82f6",
  writing: "#f97316",
  speaking: "#ec4899",
  full: "#10b981",
};

function getDisplayScore(point: AttemptPoint, isBandMode: boolean): number {
  if (isBandMode) return point.band_score;
  // percentage mode
  if (BAND_SCORE_MODULES.has(point.module_type)) {
    return Math.round((point.band_score / 9) * 100);
  }
  return Math.round((point.raw_score / 40) * 100);
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: AttemptPoint & { display_score: number };
}

function CustomDot({ cx, cy, payload }: CustomDotProps) {
  const color = moduleColor[payload?.module_type ?? "reading"] ?? "#8b5cf6";
  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="white" strokeWidth={2} />;
}

interface TooltipProps {
  active?: boolean;
  payload?: { payload: AttemptPoint & { display_score: number } }[];
  isBandMode: boolean;
}

function CustomTooltip({ active, payload, isBandMode }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const score = isBandMode ? d.band_score : `${d.display_score}%`;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-black text-base">{score}</p>
      <p className="text-muted-foreground capitalize">{d.module_type}</p>
      <p className="text-muted-foreground">{d.date}</p>
    </div>
  );
}

export function BandScoreChart({ data }: { data: AttemptPoint[] }) {
  const [active, setActive] = useState<string>("all");

  if (!data.length) return null;

  const isBandMode = BAND_SCORE_MODULES.has(active);
  const filtered = (active === "all" ? data : data.filter((d) => d.module_type === active))
    .map((d) => ({ ...d, display_score: getDisplayScore(d, isBandMode) }));
  const hasData = filtered.length > 1;

  const yDomain = isBandMode ? [0, 9] : [0, 100];
  const yTicks = isBandMode ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 25, 50, 75, 100];
  const yFormatter = isBandMode ? undefined : (v: number) => `${v}%`;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-black text-base leading-none mb-1">Band Score Trend</h3>
          <p className="text-xs text-muted-foreground">
            All completed tests over time · dashed line = 6.5 target
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              active === f.key
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={filtered} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontWeight: 700 }}
              className="fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={yDomain}
              ticks={yTicks}
              tickFormatter={yFormatter}
              tick={{ fontSize: 11, fontWeight: 700 }}
              className="fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip isBandMode={isBandMode} />} />
            {isBandMode && (
              <ReferenceLine
                y={6.5}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{ value: "6.5", fontSize: 10, fill: "#10b981", position: "right" }}
              />
            )}
            <Line
              type="monotone"
              dataKey="display_score"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[220px] text-xs text-muted-foreground font-bold">
          No data for this filter yet
        </div>
      )}
    </div>
  );
}
