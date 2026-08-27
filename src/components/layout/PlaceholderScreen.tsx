import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

/** Used by nav destinations not built yet (see the staged build plan) — keeps the shell fully wired without faking finished screens. */
export function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  return (
    <Container className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-foreground">{title}</h1>
      <Card>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Card>
    </Container>
  );
}
