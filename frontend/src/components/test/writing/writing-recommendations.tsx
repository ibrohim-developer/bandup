"use client";

import { Target, Zap, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const icons = [
  <Target key="t" className="h-5 w-5 text-red-500" />,
  <Target key="t2" className="h-5 w-5 text-red-500" />,
  <Zap key="z" className="h-5 w-5 text-yellow-500" />,
  <Zap key="z2" className="h-5 w-5 text-yellow-500" />,
  <Sparkles key="s" className="h-5 w-5 text-green-500" />,
];

const labels = ["Focus Area", "Focus Area", "Practice This", "Practice This", "Optimize"];

export function WritingRecommendations({ actions }: { actions: string[] }) {
  if (!actions.length) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-2xl font-bold">AI-Powered Recommendations</h2>
        <p className="text-muted-foreground">
          Based on your performance, here are personalized actions to improve your score:
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action, idx) => (
          <Card key={idx} className="p-6">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">{icons[idx % icons.length]}</div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {labels[idx % labels.length]}
              </span>
            </div>
            <p className="text-sm">{action}</p>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 bg-primary/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Ready to practice more?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another writing test to keep improving your score.
            </p>
          </div>
          <Link href="/dashboard/writing">
            <Button>Practice Now</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
