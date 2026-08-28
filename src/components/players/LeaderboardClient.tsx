"use client";

import { useMemo, useState } from "react";
import type { Player } from "@/types/player";
import { FilterChips } from "@/components/ui/FilterChips";
import { PlayerRankRow } from "./PlayerRankRow";
import { getMetric, rankPlayersByMetric } from "@/lib/metrics";

const METRIC_OPTIONS = [
  { value: "distance", label: "Distance" },
  { value: "topSpeed", label: "Top Speed" },
  { value: "sprints", label: "Sprints" },
  { value: "goals", label: "Goals" },
  { value: "rating", label: "Rating" },
] as const;

type MetricOption = (typeof METRIC_OPTIONS)[number]["value"];

export function LeaderboardClient({ players }: { players: Player[] }) {
  const [metricKey, setMetricKey] = useState<MetricOption>("distance");

  const ranked = useMemo(() => rankPlayersByMetric(players, metricKey), [players, metricKey]);
  const maxValue = Math.max(...ranked.map((player) => getMetric(player, metricKey)?.value ?? 0), 1);

  return (
    <div className="flex flex-col gap-4">
      <FilterChips options={METRIC_OPTIONS} value={metricKey} onChange={setMetricKey} />
      <div className="flex flex-col gap-2">
        {ranked.map((player, index) => (
          <PlayerRankRow key={player.id} player={player} rank={index + 1} metricKey={metricKey} maxValue={maxValue} />
        ))}
      </div>
    </div>
  );
}
