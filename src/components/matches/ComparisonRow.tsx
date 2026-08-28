function ComparisonBar({
  home,
  away,
  homeColor,
  awayColor,
}: {
  home: number;
  away: number;
  homeColor: string;
  awayColor: string;
}) {
  const total = home + away || 1;
  const homePercent = (home / total) * 100;

  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
      <div className="transition-[width] duration-300 ease-out" style={{ width: `${homePercent}%`, backgroundColor: homeColor }} />
      <div className="transition-[width] duration-300 ease-out" style={{ width: `${100 - homePercent}%`, backgroundColor: awayColor }} />
    </div>
  );
}

/** One split comparison bar: home value left, label center, away value right — the "thin comparison bars" from the brief. */
export function ComparisonRow({
  label,
  homeValue,
  awayValue,
  homeDisplay,
  awayDisplay,
  homeColor,
  awayColor,
  mock,
}: {
  label: string;
  homeValue: number;
  awayValue: number;
  homeDisplay: string;
  awayDisplay: string;
  homeColor: string;
  awayColor: string;
  /** See StatTile's `mock` prop — pass lib/demo-badge.ts's showMockBadge(). */
  mock?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-display text-foreground">{homeDisplay}</span>
        <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
          {label}
          {mock && <span className="h-1 w-1 rounded-full bg-amber" title="Demo data" />}
        </span>
        <span className="font-display text-foreground">{awayDisplay}</span>
      </div>
      <ComparisonBar home={homeValue} away={awayValue} homeColor={homeColor} awayColor={awayColor} />
    </div>
  );
}
