import type { Metadata } from "next";
import Link from "@/components/no-prefetch-link";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpenCheck,
  Headphones,
  PenTool,
  Mic,
  ClipboardList,
  ExternalLink,
  Trophy,
  ClipboardCheck,
} from "lucide-react";
import { fetchProgressData } from "./actions";
import { BandScoreChart } from "@/components/progress/band-score-chart";
import { ActivityHeatmap } from "@/components/progress/activity-heatmap";

export const metadata: Metadata = {
  title: "My Progress — BandUp",
  description: "Track your IELTS band score trends and practice history.",
};

const moduleIcon: Record<string, React.ReactNode> = {
  reading: <BookOpenCheck className="h-4 w-4" />,
  listening: <Headphones className="h-4 w-4" />,
  writing: <PenTool className="h-4 w-4" />,
  speaking: <Mic className="h-4 w-4" />,
  full: <ClipboardList className="h-4 w-4" />,
};



export default async function ProgressPage() {
  const data = await fetchProgressData();

  if (data === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <TrendingUp className="h-10 w-10 text-muted-foreground" />
        <p className="font-black text-sm">Sign in to see your progress</p>
        <Link
          href="/sign-in"
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-1">My Progress</h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          Your IELTS journey at a glance
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(() => {
          const fullStat = data.moduleStats.find((m) => m.module === "full");
          return [
            {
              label: "Tests Completed",
              value: data.totalCompleted || 0,
              icon: <CheckCircle2 className="h-5 w-5" />,
            },
            {
              label: "Hours Practiced",
              value: data.totalHours || 0,
              icon: <Clock className="h-5 w-5" />,
            },
            {
              label: "Full Mocks Done",
              value: fullStat?.completed ?? 0,
              icon: <ClipboardCheck className="h-5 w-5" />,
            },
            {
              label: "Best Mock Band",
              value: fullStat?.best_band ?? "—",
              icon: <Trophy className="h-5 w-5" />,
            },
          ];
        })().map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-bold">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity + Band Score row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <ActivityHeatmap
            activityMap={data.activityMap}
            totalActive={Object.keys(data.activityMap).length}
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <BandScoreChart data={data.trendPoints} />
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-black text-sm">Recent Activity</h3>
          <Link
            href="/dashboard/history"
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
        {data.recentAttempts.length > 0 ? (
          <div className="divide-y divide-border">
            {data.recentAttempts.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                  {moduleIcon[a.module_type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black">{a.title ?? `${a.module_type.charAt(0).toUpperCase() + a.module_type.slice(1)} Test`}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                {(a.module_type === "reading" || a.module_type === "listening") ? (
                  a.raw_score != null && (
                    <span className="text-lg font-black">{Math.round((a.raw_score / 40) * 100)}%</span>
                  )
                ) : (
                  a.band_score != null && (
                    <span className="text-lg font-black">{a.band_score}</span>
                  )
                )}
                <Link href={`/dashboard/results/${a.id}`}>
                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-xs text-muted-foreground font-bold">
            No activity yet — take your first test!
          </div>
        )}
      </div>
    </div>
  );
}
