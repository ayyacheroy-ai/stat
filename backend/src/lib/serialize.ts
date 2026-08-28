import type { Player, PlayerMatchStatistic } from "@prisma/client";

export type MetricBag = Record<string, { value: number; source: "tracker" | "mock" }>;

/** Builds a frontend-shaped MetricBag from this backend's statistic rows. Every row here is real, so source is always "tracker". */
export function buildMetricBag(stats: PlayerMatchStatistic[]): MetricBag {
  const bag: MetricBag = {};
  for (const stat of stats) {
    bag[stat.metricKey] = { value: stat.value, source: "tracker" };
  }
  return bag;
}

/**
 * Bio is entirely unpopulated today (see prisma/schema.prisma's Player
 * model comment) — this returns `{}` exactly like the frontend's current
 * CSV adapter, and will start including fields the moment a row has them
 * set, with no shape change needed on either side.
 */
export function serializeBio(player: Player) {
  const bio: Record<string, unknown> = {};
  if (player.heightCm != null) bio.heightCm = player.heightCm;
  if (player.ageYears != null) bio.ageYears = player.ageYears;
  if (player.dateOfBirth != null) bio.dateOfBirth = player.dateOfBirth;
  if (player.preferredFoot != null) bio.preferredFoot = player.preferredFoot;
  if (player.country != null) bio.country = player.country;
  if (player.shirtNumber != null) bio.shirtNumber = player.shirtNumber;
  if (player.marketValueEur != null) bio.marketValueEur = player.marketValueEur;
  if (player.contractEndYear != null) bio.contractEndYear = player.contractEndYear;
  return bio;
}

export function serializePlayer(player: Player, stats: PlayerMatchStatistic[]) {
  return {
    trackerId: player.trackerId,
    teamId: player.teamId,
    name: player.name,
    metrics: buildMetricBag(stats),
    bio: serializeBio(player),
  };
}
