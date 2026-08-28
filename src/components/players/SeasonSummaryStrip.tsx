import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import type { Player } from "@/types/player";
import { getMetricDefinition } from "@/data/registry/metrics";
import { formatPlayerMetric, getMetric, getMetricUnit } from "@/lib/metrics";
import { showMockBadge } from "@/lib/demo-badge";

const SEASON_KEYS = [
  "goals",
  "assists",
  "matchesStarted",
  "matchesPlayed",
  "minutesPlayed",
  "rating",
  "yellowCards",
  "redCards",
];

// The one thing our tracker genuinely measures today — kept visually
// distinct (separate labeled row) so it's clear these aren't generated,
// without giving the tiles themselves a different look per metric.
const PHYSICAL_KEYS = ["distance", "topSpeed", "averageSpeed", "sprints"];

function MetricRow({ player, keys }: { player: Player; keys: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {keys.map((key) => {
        const def = getMetricDefinition(key);
        return (
          <StatTile
            key={key}
            label={def?.label ?? key}
            value={formatPlayerMetric(player, key)}
            unit={getMetricUnit(key)}
            // Checked per-metric rather than assumed by group: a CSV
            // upload can flip an individual Season stat to real without
            // moving it out of this row, so the badge has to reflect the
            // metric's actual current source, not just which section it's in.
            mock={showMockBadge(getMetric(player, key)?.source === "mock")}
          />
        );
      })}
    </div>
  );
}

export function SeasonSummaryStrip({ player }: { player: Player }) {
  return (
    <Card className="flex flex-col gap-5">
      <div>
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Season
        </div>
        <MetricRow player={player} keys={SEASON_KEYS} />
      </div>
      <div className="border-t border-border pt-4">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-accent">
          Physical · Tracked Live
        </div>
        <MetricRow player={player} keys={PHYSICAL_KEYS} />
      </div>
    </Card>
  );
}
