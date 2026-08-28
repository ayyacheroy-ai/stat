import Link from "next/link";
import type { Player } from "@/types/player";
import { RatingPill } from "@/components/ui/RatingPill";
import { TeamDot } from "@/components/ui/TeamDot";
import { getTeamColor } from "@/config/app-config";
import { generatePlayerProfileExtras } from "@/data/mock/generate-player-profile";
import { getMetric } from "@/lib/metrics";

/** Simple lineup list below the pitch: name, position, rating — every row clickable. */
export function LineupList({ players }: { players: Player[] }) {
  return (
    <div className="flex flex-col gap-2">
      {players.map((player) => {
        const extras = generatePlayerProfileExtras(
          player.trackerId,
          player.bio.marketValueEur ?? 500_000,
          getMetric(player, "rating")?.value ?? 6.5,
        );
        const rating = getMetric(player, "rating")?.value ?? 6.0;

        return (
          <Link key={player.id} href={`/players/${player.id}`} className="block">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition hover:border-accent/40 active:scale-[0.98]">
              <TeamDot color={getTeamColor(player.teamId)} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {player.name}
              </span>
              <span className="w-10 shrink-0 text-xs text-muted-foreground">
                {extras.position.primary}
              </span>
              <RatingPill rating={rating} size="sm" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
