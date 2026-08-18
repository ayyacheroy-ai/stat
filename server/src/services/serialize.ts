/**
 * GameStat.metrics and PlayerAward.value are stored as JSON strings (SQLite
 * doesn't support Prisma's Json type — see prisma/schema.prisma). These
 * helpers parse them back into objects before a route sends them in a
 * response, so API consumers always see nested objects, never raw strings.
 */

export function withParsedMetrics<T extends { metrics: string }>(
  stat: T
): Omit<T, "metrics"> & { metrics: Record<string, number> } {
  return { ...stat, metrics: JSON.parse(stat.metrics) };
}

export function withParsedAwardValue<T extends { value: string | null }>(
  playerAward: T
): Omit<T, "value"> & { value: Record<string, number> | null } {
  return { ...playerAward, value: playerAward.value ? JSON.parse(playerAward.value) : null };
}
