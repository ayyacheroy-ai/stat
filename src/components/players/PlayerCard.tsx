import type { Player } from "@/types/player";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatValue } from "@/components/ui/StatValue";
import { getTeamColor, getTeamName } from "@/config/app-config";
import {
  formatCount,
  formatDistanceKm,
  formatSpeedKmh,
  formatSpeedMs,
} from "@/lib/format";

export function PlayerCard({ player }: { player: Player }) {
  const { metrics } = player;

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
        <StatValue
          label="Distance"
          value={formatDistanceKm(metrics.distance)}
          unit="km"
          emphasis
        />
        <StatValue
          label="Top Speed"
          value={formatSpeedKmh(metrics.topSpeed)}
          unit="km/h"
          emphasis
        />
        <StatValue
          label="Avg Speed"
          value={formatSpeedMs(metrics.averageSpeed)}
          unit="m/s"
        />
        <StatValue label="Sprints" value={formatCount(metrics.sprints)} />
      </div>
    </Card>
  );
}
