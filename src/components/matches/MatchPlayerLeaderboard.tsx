import type { Player } from "@/types/player";
import { Card } from "@/components/ui/Card";
import { PlayerRankRow } from "@/components/players/PlayerRankRow";
import { getMetric, rankPlayersByMetric } from "@/lib/metrics";

/** Only rendered for the one match with real per-player data — see Match.isTracked. */
export function MatchPlayerLeaderboard({ players }: { players: Player[] }) {
  const ranked = rankPlayersByMetric(players, "distance");
  const maxValue = Math.max(...ranked.map((player) => getMetric(player, "distance")?.value ?? 0), 1);

  return (
    <Card className="flex flex-col gap-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Player Leaderboard · Distance
      </div>
      <div className="flex flex-col gap-2">
        {ranked.map((player, index) => (
          <PlayerRankRow key={player.id} player={player} rank={index + 1} metricKey="distance" maxValue={maxValue} />
        ))}
      </div>
    </Card>
  );
}
