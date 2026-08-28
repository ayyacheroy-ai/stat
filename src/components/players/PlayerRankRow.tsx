import Link from "next/link";
import type { Player } from "@/types/player";
import { RankBadge } from "@/components/ui/RankBadge";
import { TeamDot } from "@/components/ui/TeamDot";
import { StatBar } from "@/components/ui/StatBar";
import { getTeamColor } from "@/config/app-config";
import { formatPlayerMetric, getMetric, getMetricUnit } from "@/lib/metrics";

/** One dense, scannable leaderboard row — reused by the full leaderboard, Home's top-performers preview, and a match's player leaderboard. */
export function PlayerRankRow({
  player,
  rank,
  metricKey,
  maxValue,
}: {
  player: Player;
  rank: number;
  metricKey: string;
  maxValue: number;
}) {
  const value = getMetric(player, metricKey)?.value ?? 0;
  const unit = getMetricUnit(metricKey);

  return (
    <Link href={`/players/${player.id}`} className="block">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-colors hover:border-accent/40">
        <RankBadge rank={rank} />
        <TeamDot color={getTeamColor(player.teamId)} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{player.name}</span>
        <span className="w-20 shrink-0 text-right font-display text-sm text-foreground">
          {formatPlayerMetric(player, metricKey)}
          {unit && <span className="ml-1 text-xs text-muted-foreground">{unit}</span>}
        </span>
        <div className="hidden w-16 shrink-0 sm:block">
          <StatBar value={value} max={maxValue} color={getTeamColor(player.teamId)} />
        </div>
      </div>
    </Link>
  );
}
