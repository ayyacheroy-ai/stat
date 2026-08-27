export function formatDistanceKm(meters: number | undefined): string | null {
  if (meters == null) return null;
  return (meters / 1000).toFixed(2);
}

export function formatSpeedKmh(kmh: number | undefined): string | null {
  if (kmh == null) return null;
  return kmh.toFixed(1);
}

export function formatSpeedMs(ms: number | undefined): string | null {
  if (ms == null) return null;
  return ms.toFixed(2);
}

export function formatCount(value: number | undefined): string | null {
  if (value == null) return null;
  return String(Math.round(value));
}
