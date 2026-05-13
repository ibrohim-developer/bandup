import type { Metadata } from "next";
import Link from "@/components/no-prefetch-link";
import { ClipboardList, ExternalLink, ArrowLeft } from "lucide-react";
import { fetchFullMockAttempts } from "@/app/(dashboard)/dashboard/progress/actions";

export const metadata: Metadata = {
  title: "Full Mock Test History — BandUp",
  description: "All your completed IELTS full mock test attempts.",
};


export default async function FullMockHistoryPage() {
  const attempts = await fetchFullMockAttempts();

  const tableHeaders = ["#", "Date", "Test", "Listening", "Reading", "Writing", "Speaking", "Overall", ""];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/full-mock-test"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mt-2 md:mt-0 mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Full Mock Tests
        </Link>
        <h2 className="text-2xl md:text-3xl font-black mb-1">Full Mock Test History</h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          All completed full mock attempts
        </p>
      </div>

      {/* Table card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {attempts.length > 0 ? (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {tableHeaders.map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-bold text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {attempts.map((a, i) => (
                    <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-4 text-muted-foreground font-bold text-xs">{i + 1}</td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap text-xs">{a.date}</td>
                      <td className="px-5 py-4 font-bold max-w-[200px] truncate">{a.testTitle}</td>
                      <td className="px-5 py-4"><ScoreBadge value={a.listening} /></td>
                      <td className="px-5 py-4"><ScoreBadge value={a.reading} /></td>
                      <td className="px-5 py-4"><ScoreBadge value={a.writing} /></td>
                      <td className="px-5 py-4"><ScoreBadge value={a.speaking} /></td>
                      <td className="px-5 py-4">
                        <span className="font-black text-base">{a.overall ?? "—"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/dashboard/full-mock-test/results/${a.id}`}>
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="md:hidden divide-y divide-border">
              {attempts.map((a, i) => (
                <li key={a.id}>
                  <Link
                    href={`/dashboard/full-mock-test/results/${a.id}`}
                    className="block p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{a.testTitle}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          #{i + 1} · {a.date}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overall</p>
                        <p className="font-black text-2xl leading-none mt-0.5">{a.overall ?? "—"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <ScoreCell label="L" value={a.listening} />
                      <ScoreCell label="R" value={a.reading} />
                      <ScoreCell label="W" value={a.writing} />
                      <ScoreCell label="S" value={a.speaking} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground" />
            <p className="font-black text-sm">No full mock tests completed yet</p>
            <p className="text-xs text-muted-foreground">Complete a full mock test to see your results here.</p>
            <Link
              href="/dashboard/full-mock-test"
              className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-all"
            >
              Take a Full Mock
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


function ScoreBadge({ value }: { value: number | null }) {
  if (value == null) return <span className="text-muted-foreground font-bold">—</span>;
  const color = value >= 7 ? "text-emerald-500" : value >= 6 ? "text-yellow-500" : "text-red-400";
  return <span className={`font-black ${color}`}>{value}</span>;
}

function ScoreCell({ label, value }: { label: string; value: number | null }) {
  const color =
    value == null
      ? "text-muted-foreground"
      : value >= 7
        ? "text-emerald-500"
        : value >= 6
          ? "text-yellow-500"
          : "text-red-400";
  return (
    <div className="bg-muted/40 rounded-md py-1.5">
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className={`font-black text-sm ${color}`}>{value ?? "—"}</p>
    </div>
  );
}