"use client";

import { Card } from "@/components/ui/card";

interface CriterionScore {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

interface SpeakingScoreBreakdownProps {
  criteria: CriterionScore[];
}

export function SpeakingScoreBreakdown({
  criteria,
}: SpeakingScoreBreakdownProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {criteria.map((criterion, idx) => {
        const percentage = (criterion.score / criterion.maxScore) * 100;
        const getColor = (percent: number) => {
          if (percent >= 80) return "bg-green-500";
          if (percent >= 60) return "bg-yellow-500";
          return "bg-red-500";
        };

        return (
          <Card key={idx} className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{criterion.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {criterion.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {criterion.score}
                </div>
                <div className="text-xs text-muted-foreground">
                  / {criterion.maxScore}
                </div>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${getColor(percentage)}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="mt-2 text-right text-xs font-medium text-muted-foreground">
              {Math.round(percentage)}%
            </div>
          </Card>
        );
      })}
    </div>
  );
}
