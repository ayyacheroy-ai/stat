import { Card } from "@/components/ui/Card";

/** Keeps the profile's full scroll structure honest while a section (heatmap, shot map) isn't built yet. */
export function ComingSoonCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
