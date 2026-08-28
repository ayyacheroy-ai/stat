import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import type { Player } from "@/types/player";
import { getMetricDefinition } from "@/data/registry/metrics";
import { formatPlayerMetric, getMetricUnit } from "@/lib/metrics";
import { showMockBadge } from "@/lib/demo-badge";

/**
 * Brief §4's "small Performance section": Shots, Passes, Successful
 * Passes, Tackles, Interceptions. There's no raw "successful passes" count
 * in the metric registry (only pass accuracy, a %) — Pass Accuracy is
 * substituted rather than inventing a completed-pass number.
 */
const PERFORMANCE_KEYS = ["shots", "passes", "passAccuracy", "tackles", "interceptions"];

export function PerformanceCard({ player }: { player: Player }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Performance</div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {PERFORMANCE_KEYS.map((key) => {
          const def = getMetricDefinition(key);
          return (
            <StatTile
              key={key}
              label={def?.label ?? key}
              value={formatPlayerMetric(player, key)}
              unit={getMetricUnit(key)}
              mock={showMockBadge(true)}
            />
          );
        })}
      </div>
    </Card>
  );
}
