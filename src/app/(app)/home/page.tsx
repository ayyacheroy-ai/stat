import { getPlayers } from "@/lib/data-source";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PlayerCard } from "@/components/players/PlayerCard";
import { appConfig } from "@/config/app-config";

/**
 * Foundation test screen (Stage A). Proves the design system and data
 * pipeline work end to end — CSV -> adapter -> mock fill-in -> normalized
 * Player[] -> UI — through the new generalized metric-registry model.
 * The full FotMob-style dashboard (hero match card, headline team stats,
 * leaderboard preview) is a later stage; this keeps the previously
 * working player cards intact while the model underneath changes.
 */
export default async function HomePage() {
  const players = await getPlayers();

  return (
    <Container className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl text-foreground">
          Football Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          {appConfig.brand.tagline}
        </p>
      </header>

      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-sm font-medium text-foreground">
            Data loaded
          </span>
        </div>
        <span className="font-display text-lg text-foreground">
          {players.length} players
        </span>
      </Card>

      <div className="flex flex-col gap-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </Container>
  );
}
