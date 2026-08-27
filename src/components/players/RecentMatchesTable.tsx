import { Card } from "@/components/ui/Card";
import { WDLBadge } from "@/components/ui/WDLBadge";
import { RatingPill } from "@/components/ui/RatingPill";
import type { MockMatch } from "@/types/profile";

export function RecentMatchesTable({ matches }: { matches: MockMatch[] }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Recent Matches
      </div>
      <div className="-mx-5 flex flex-col divide-y divide-border">
        {matches.map((match) => (
          <div key={match.id} className="flex items-center gap-3 px-5 py-3">
            <WDLBadge result={match.result} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">{match.opponent}</div>
              <div className="text-xs text-muted-foreground">
                {match.date} · {match.competition}
              </div>
            </div>
            <div className="font-display text-sm text-foreground">
              {match.scoreFor}-{match.scoreAgainst}
            </div>
            <div className="w-9 text-right text-xs text-muted-foreground">{match.minutesPlayed}&apos;</div>
            <RatingPill rating={match.rating} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
}
