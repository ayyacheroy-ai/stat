import type { Player } from "@/types/player";
import { getMetric } from "@/lib/metrics";
import { formatMetricValue } from "@/data/registry/metrics";

/** Compact inline stat line, brief §4: "2 Goals · 1 Assist · 6.2 km · 5 Sprints · 32.4 km/h · 90'". */
export function PlayerMainStats({ player }: { player: Player }) {
  const goals = getMetric(player, "goals")?.value;
  const assists = getMetric(player, "assists")?.value;
  const distance = getMetric(player, "distance")?.value;
  const sprints = getMetric(player, "sprints")?.value;
  const topSpeed = getMetric(player, "topSpeed")?.value;
  const minutes = getMetric(player, "minutesPlayed")?.value;

  const parts: string[] = [];
  if (goals != null) parts.push(`${goals} Goal${goals === 1 ? "" : "s"}`);
  if (assists != null) parts.push(`${assists} Assist${assists === 1 ? "" : "s"}`);
  if (distance != null) parts.push(`${formatMetricValue("distance", distance)} km`);
  if (sprints != null) parts.push(`${sprints} Sprint${sprints === 1 ? "" : "s"}`);
  if (topSpeed != null) parts.push(`${formatMetricValue("topSpeed", topSpeed)} km/h`);
  if (minutes != null) parts.push(`${minutes}'`);

  if (parts.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-foreground">
      {parts.map((part, index) => (
        <span key={part} className="flex items-center gap-2">
          {index > 0 && <span className="text-muted-foreground">·</span>}
          {part}
        </span>
      ))}
    </div>
  );
}
