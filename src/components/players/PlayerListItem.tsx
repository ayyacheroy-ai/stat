import Link from "next/link";
import type { Player } from "@/types/player";
import { TeamDot } from "@/components/ui/TeamDot";
import { getTeamColor } from "@/config/app-config";
import { formatPlayerMetric, getMetricUnit } from "@/lib/metrics";

/** Players list row: team dot, name, one headline stat — lighter than PlayerRankRow (no rank/bar, this isn't a ranking). */
export function PlayerListItem({ player }: { player: Player }) {
  return (
    <Link href={`/players/${player.id}`} className="block">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-colors hover:border-accent/40">
        <TeamDot color={getTeamColor(player.teamId)} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{player.name}</span>
        <span className="font-display text-sm text-foreground">
          {formatPlayerMetric(player, "distance")}
          <span className="ml-1 text-xs text-muted-foreground">{getMetricUnit("distance")}</span>
        </span>
      </div>
    </Link>
  );
}
