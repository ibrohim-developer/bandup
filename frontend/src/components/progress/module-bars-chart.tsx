"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ModuleStat } from "@/app/(dashboard)/dashboard/progress/actions";

const moduleColor: Record<string, string> = {
  reading: "#8b5cf6",
  listening: "#3b82f6",
  writing: "#f97316",
  speaking: "#ec4899",
  full: "#10b981",
};

interface TooltipProps {
  active?: boolean;
  payload?: { payload: ModuleStat }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs space-y-0.5">
      <p className="font-black capitalize">{d.module}</p>
      <p className="text-muted-foreground">Avg: <span className="text-foreground font-bold">{d.avg_band}</span></p>
      <p className="text-muted-foreground">Best: <span className="text-foreground font-bold">{d.best_band}</span></p>
      <p className="text-muted-foreground">Tests: <span className="text-foreground font-bold">{d.completed}</span></p>
    </div>
  );
}

export function ModuleBarsChart({ data }: { data: ModuleStat[] }) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
        <XAxis
          dataKey="module"
          tick={{ fontSize: 11, fontWeight: 700 }}
          tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1, 4)}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 9]}
          ticks={[3, 6, 9]}
          tick={{ fontSize: 11, fontWeight: 700 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar dataKey="avg_band" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell
              key={entry.module}
              fill={moduleColor[entry.module] ?? "#8b5cf6"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
