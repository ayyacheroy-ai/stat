import { TeamDot } from "./TeamDot";

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-foreground">
      <TeamDot color={color} />
      {label}
    </span>
  );
}
