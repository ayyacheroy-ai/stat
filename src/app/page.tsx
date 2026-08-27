import { getPlayers } from "@/lib/data-source";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PlayerCard } from "@/components/players/PlayerCard";
import { appConfig } from "@/config/app-config";

/**
 * Foundation test screen (see architecture brief, stage 1). This proves the
 * design system and data pipeline work end to end — CSV -> adapter ->
 * normalized Player[] -> UI — before any real dashboard screens are built.
 */
export default async function Home() {
  const players = await getPlayers();

  return (
    <main className="min-h-dvh pt-10 pb-16">
      <Container className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            {appConfig.brand.name}
          </span>
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
    </main>
  );
}
