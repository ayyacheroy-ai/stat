import type { Player } from "@/types/player";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatTile } from "@/components/ui/StatTile";
import { getTeamColor, getTeamName } from "@/config/app-config";
import { formatPlayerMetric, getMetricUnit } from "@/lib/metrics";

/**
 * Shows the player's REAL physical stats only (distance, top speed, avg
 * speed, sprints) — these are the four fields our tracker genuinely
 * produces today. Mock stats (rating, goals, etc.) belong on the full
 * Player Profile page, not this summary card.
 */
export function PlayerCard({ player }: { player: Player }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Player
          </div>
          <div className="font-display text-xl text-foreground">
            {player.name}
          </div>
        </div>
        <Badge
          label={getTeamName(player.teamId)}
          color={getTeamColor(player.teamId)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
        <StatTile
          label="Distance"
          value={formatPlayerMetric(player, "distance")}
          unit={getMetricUnit("distance")}
          emphasis
        />
        <StatTile
          label="Top Speed"
          value={formatPlayerMetric(player, "topSpeed")}
          unit={getMetricUnit("topSpeed")}
          emphasis
        />
        <StatTile
          label="Avg Speed"
          value={formatPlayerMetric(player, "averageSpeed")}
          unit={getMetricUnit("averageSpeed")}
        />
        <StatTile
          label="Sprints"
          value={formatPlayerMetric(player, "sprints")}
        />
      </div>
    </Card>
  );
}
