import { Card } from "@/components/ui/Card";
import { RankBadge } from "@/components/ui/RankBadge";
import type { Player } from "@/types/player";
import type { MetricGroup } from "@/types/metrics";
import {
  formatMetricValue,
  getMetricsByGroup,
  metricGroupLabels,
  metricGroupOrder,
} from "@/data/registry/metrics";
import { getMetric } from "@/lib/metrics";
import { showMockBadge } from "@/lib/demo-badge";

/**
 * Per-90 scaling only makes sense for cumulative counting stats over a
 * real season — never for the real Physical group (a single ~45-second
 * tracked clip, not a full match: linearly extrapolating that to 90
 * minutes would effectively be inventing a number for a real field,
 * which §2 explicitly forbids), and never for rates/percentages or
 * appearance counts that are already season totals.
 */
function isPerNinetyEligible(group: MetricGroup, unit: string | undefined): boolean {
  return group !== "physical" && group !== "overall" && unit !== "%";
}

function computeRank(
  allPlayers: Player[],
  key: string,
  higherIsBetter: boolean,
  playerId: string,
): number | null {
  const values = allPlayers
    .map((candidate) => ({ id: candidate.id, value: getMetric(candidate, key)?.value }))
    .filter((entry): entry is { id: string; value: number } => entry.value !== undefined);

  if (values.length < 2) return null;

  values.sort((a, b) => (higherIsBetter ? b.value - a.value : a.value - b.value));
  const index = values.findIndex((entry) => entry.id === playerId);
  return index === -1 ? null : index + 1;
}

/**
 * Renders itself entirely from the metric registry's groups — adding a
 * new stat to the registry makes it appear here automatically, no row to
 * hand-add.
 */
export function SeasonPerformanceTable({ player, allPlayers }: { player: Player; allPlayers: Player[] }) {
  const minutesPlayed = getMetric(player, "minutesPlayed")?.value;

  return (
    <Card className="flex flex-col gap-6">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Season Performance
      </div>

      {metricGroupOrder.map((group) => {
        const defs = getMetricsByGroup(group).filter((def) => getMetric(player, def.key));
        if (defs.length === 0) return null;

        return (
          <div key={group} className="flex flex-col gap-1">
            <div className="mb-1 text-xs font-semibold text-foreground">{metricGroupLabels[group]}</div>
            <div className="flex items-center gap-3 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <span className="flex-1">Stat</span>
              <span className="w-14 text-right">Total</span>
              <span className="w-14 text-right">Per 90</span>
              <span className="w-8 text-right">Rank</span>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {defs.map((def) => {
                const metric = getMetric(player, def.key);
                if (!metric) return null;

                const total = formatMetricValue(def.key, metric.value);
                const perNinety =
                  isPerNinetyEligible(def.group, def.unit) && minutesPlayed
                    ? formatMetricValue(def.key, (metric.value / minutesPlayed) * 90)
                    : "—";
                const rank = computeRank(allPlayers, def.key, def.higherIsBetter, player.id);

                return (
                  <div key={def.key} className="flex items-center gap-3 py-2 text-sm">
                    <span className="flex flex-1 items-center gap-1 text-foreground">
                      {def.label}
                      {showMockBadge(metric.source === "mock") && (
                        <span className="h-1 w-1 rounded-full bg-amber" title="Demo data" />
                      )}
                    </span>
                    <span className="w-14 text-right font-display text-foreground">
                      {total}
                      {def.unit && <span className="ml-0.5 text-xs text-muted-foreground">{def.unit}</span>}
                    </span>
                    <span className="w-14 text-right text-muted-foreground">{perNinety}</span>
                    <span className="flex w-8 justify-end">
                      {rank ? <RankBadge rank={rank} /> : <span className="text-muted-foreground">—</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </Card>
  );
}
