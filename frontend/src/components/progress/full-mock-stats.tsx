"use client";

import Link from "@/components/no-prefetch-link";
import { ExternalLink, ClipboardList } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { FullMockAttempt } from "@/app/(dashboard)/dashboard/progress/actions";

const DUMMY_ATTEMPTS: FullMockAttempt[] = [
  { id: "1", testTitle: "IELTS Full Mock Test 1", date: "12 Mar 2025", listening: 7.0, reading: 6.5, writing: 6.0, speaking: 6.5, overall: 6.5 },
  { id: "2", testTitle: "IELTS Full Mock Test 2", date: "22 Mar 2025", listening: 7.5, reading: 7.0, writing: 6.5, speaking: 7.0, overall: 7.0 },
  { id: "3", testTitle: "IELTS Full Mock Test 3", date: "1 Apr 2025",  listening: 6.5, reading: 6.0, writing: 5.5, speaking: 6.0, overall: 6.0 },
  { id: "4", testTitle: "IELTS Full Mock Test 1", date: "10 Apr 2025", listening: 8.0, reading: 7.5, writing: 7.0, speaking: 7.5, overall: 7.5 },
];

const SECTION_COLORS: Record<string, string> = {
  Listening: "#3b82f6",
  Reading: "#8b5cf6",
  Writing: "#f97316",
  Speaking: "#ec4899",
};

function calcAvg(attempts: FullMockAttempt[], key: keyof FullMockAttempt) {
  const vals = attempts.map((a) => a[key] as number | null).filter((v) => v != null) as number[];
  if (!vals.length) return 0;
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
}

function ScoreBadge({ value }: { value: number | null }) {
  if (value == null) return <span className="text-muted-foreground text-xs font-bold">—</span>;
  const color = value >= 7 ? "text-emerald-500" : value >= 6 ? "text-yellow-500" : "text-red-400";
  return <span className={`font-black text-sm ${color}`}>{value}</span>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-black text-sm" style={{ color: SECTION_COLORS[d.skill] }}>{d.skill}</p>
      <p className="text-muted-foreground">Avg band: <span className="text-foreground font-black">{d.score}</span></p>
    </div>
  );
}

export function FullMockStats({ attempts }: { attempts: FullMockAttempt[] }) {
  const data = attempts.length > 0 ? attempts : DUMMY_ATTEMPTS;
  const isDummy = attempts.length === 0;

  const radarData = [
    { skill: "Listening", score: calcAvg(data, "listening"), fullMark: 9 },
    { skill: "Reading",   score: calcAvg(data, "reading"),   fullMark: 9 },
    { skill: "Writing",   score: calcAvg(data, "writing"),   fullMark: 9 },
    { skill: "Speaking",  score: calcAvg(data, "speaking"),  fullMark: 9 },
  ];


  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-6">
        <div>
          <h3 className="font-black text-base">Full Mock Test Results</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            All 4 sections per attempt{isDummy && " · sample data"}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard/full-mock-test/history"
            className="text-sm font-bold px-4 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors shrink-0"
          >
            View all
          </Link>
        </div>
      </div>

      {/* Radar + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
        {/* Radar */}
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-border flex flex-col">
          <p className="text-xs font-bold text-muted-foreground mb-3">Avg score by section</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid className="stroke-border" />
              <PolarAngleAxis
                dataKey="skill"
                tick={({ x, y, payload }) => (
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fill={SECTION_COLORS[payload.value] ?? "currentColor"}>
                    {payload.value}
                  </text>
                )}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground text-center mt-1">Target: 6.5 per section</p>
        </div>

        {/* Table */}
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Test", "L", "R", "W", "S", "Overall", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-bold text-muted-foreground whitespace-nowrap first:pl-5 last:pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 pl-5 text-muted-foreground whitespace-nowrap">{a.date}</td>
                    <td className="px-4 py-3 font-bold whitespace-nowrap max-w-[180px] truncate">{a.testTitle}</td>
                    <td className="px-4 py-3"><ScoreBadge value={a.listening} /></td>
                    <td className="px-4 py-3"><ScoreBadge value={a.reading} /></td>
                    <td className="px-4 py-3"><ScoreBadge value={a.writing} /></td>
                    <td className="px-4 py-3"><ScoreBadge value={a.speaking} /></td>
                    <td className="px-4 py-3"><span className="font-black text-sm">{a.overall ?? "—"}</span></td>
                    <td className="px-4 py-3 pr-5">
                      <Link href={`/dashboard/results/${a.id}`}>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-black">No mock tests completed yet</p>
            <Link
              href="/dashboard/full-mock-test"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-all"
            >
              Take your first mock
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
