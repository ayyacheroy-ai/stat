import { Card } from "@/components/ui/Card";
import type { Player } from "@/types/player";
import type { PlayerProfileExtras } from "@/types/profile";
import { buildPlayerAbout } from "@/lib/generate-about-text";

export function AboutCard({ player, extras }: { player: Player; extras: PlayerProfileExtras }) {
  const { summary, recentForm } = buildPlayerAbout(player, extras);

  return (
    <Card className="flex flex-col gap-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">About</div>
      <p className="text-sm leading-relaxed text-foreground">{summary}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{recentForm}</p>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Teammates
          </div>
          <ul className="flex flex-col gap-1 text-sm text-foreground">
            {extras.teammates.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Career
          </div>
          <ul className="flex flex-col gap-1 text-sm text-foreground">
            {extras.careerClubs.map((club) => (
              <li key={club.club}>
                {club.club}{" "}
                <span className="text-muted-foreground">
                  ({club.fromYear}–{club.toYear ?? "present"})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
