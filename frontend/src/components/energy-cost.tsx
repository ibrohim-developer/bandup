import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small "⚡N" pill marking how much Energy an AI-scored test costs. Purely
 * presentational (usable in server components) — the number comes from
 * `ENERGY_COSTS` in `lib/energy.ts`. Only rendered on modules that spend
 * energy (writing, speaking); reading/listening are free and show nothing.
 */
export function EnergyCost({
  cost,
  className,
}: {
  cost: number;
  className?: string;
}) {
  return (
    <span
      title={`Costs ${cost} energy for AI scoring`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 px-2 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-400",
        className
      )}
    >
      <Zap className="h-3 w-3 fill-current" />
      {cost}
    </span>
  );
}
