import type { Match } from "@/types/match";
import { Card } from "@/components/ui/Card";
import { LineupPitch } from "./LineupPitch";
import { LineupList } from "./LineupList";

/**
 * Lineups only exist for `Match.isTracked` — the mock match history has no
 * `players` at all (never tracked), so there's nothing to place on a pitch
 * for those matches. Shown as an honest empty state rather than invented.
 */
export function LineupsSection({ match }: { match: Match }) {
  if (match.players.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">
          Lineups aren&apos;t available for this match — no per-player tracking data exists for it.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <LineupPitch match={match} />
      </Card>
      <LineupList players={match.players} />
    </div>
  );
}
