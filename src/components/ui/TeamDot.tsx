export function TeamDot({ color }: { color?: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ backgroundColor: color ?? "currentColor" }}
    />
  );
}
