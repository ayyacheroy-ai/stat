import Link from "next/link";
import type { Match } from "@/types/match";
import type { Player } from "@/types/player";
import { Pitch } from "@/components/pitch/Pitch";
import { RatingPill } from "@/components/ui/RatingPill";
import { getPositionCoord } from "@/data/mock/position-coords";
import { generatePlayerProfileExtras } from "@/data/mock/generate-player-profile";
import { getMetric } from "@/lib/metrics";
import { getTeamColor } from "@/config/app-config";

interface Marker {
  player: Player;
  x: number;
  y: number;
}

/**
 * Position (needed to place a dot) isn't on the core Player type — it only
 * exists in the mock profile-extras generator, seeded per trackerId, same
 * source the player page's own position card already uses. Home defends
 * the bottom of the pitch per position-coords.ts's convention (GK near
 * y=100); away is vertically mirrored so both lineups face each other.
 */
function buildMarkers(players: Player[], teamId: number, mirror: boolean): Marker[] {
  return players
    .filter((player) => player.teamId === teamId)
    .map((player) => {
      const extras = generatePlayerProfileExtras(
        player.trackerId,
        player.bio.marketValueEur ?? 500_000,
        getMetric(player, "rating")?.value ?? 6.5,
      );
      const coord = getPositionCoord(extras.position.primary);
      return { player, x: coord.x, y: mirror ? 100 - coord.y : coord.y };
    });
}

function PlayerMarker({ marker }: { marker: Marker }) {
  const { player, x, y } = marker;
  const rating = getMetric(player, "rating")?.value ?? 6.0;

  return (
    <Link
      href={`/players/${player.id}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      className="absolute flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-black/85"
        style={{ backgroundColor: getTeamColor(player.teamId) }}
      >
        {player.bio.shirtNumber ?? "—"}
      </span>
      <span className="max-w-full truncate text-center text-[10px] font-medium text-foreground">
        {player.name}
      </span>
      <RatingPill rating={rating} size="sm" />
    </Link>
  );
}

export function LineupPitch({ match }: { match: Match }) {
  const homeMarkers = buildMarkers(match.players, match.teams[0].id, false);
  const awayMarkers = buildMarkers(match.players, match.teams[1].id, true);

  return (
    <div className="relative mx-auto w-full max-w-xs" style={{ aspectRatio: "300 / 450" }}>
      <Pitch orientation="full" className="absolute inset-0" />
      {[...homeMarkers, ...awayMarkers].map((marker) => (
        <PlayerMarker key={marker.player.id} marker={marker} />
      ))}
    </div>
  );
}
