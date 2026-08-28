/** Thin horizontal fill bar for showing a value relative to a max (pass %, squad-relative distance, etc). */
export function StatBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
      <div
        className="h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${percent}%`, backgroundColor: color ?? "var(--color-accent)" }}
      />
    </div>
  );
}
