import type { Player } from "@/types/player";
import type { PlayerProfileExtras } from "@/types/profile";
import { formatMetricValue } from "@/data/registry/metrics";
import { getMetric } from "./metrics";

/**
 * Builds the About section's prose from the player's actual data —
 * mostly mock (age, foot, country, position, rating, season totals) but
 * explicitly calling out the physical numbers as real, since those are
 * the one part of this paragraph that came from the tracker rather than
 * a generator.
 */
export function buildPlayerAbout(player: Player, extras: PlayerProfileExtras) {
  const { bio } = player;
  const position = extras.position.secondary
    ? `${extras.position.primary}/${extras.position.secondary}`
    : extras.position.primary;
  const foot = bio.preferredFoot ? `${bio.preferredFoot}-footed` : "";

  const rating = getMetric(player, "rating")?.value;
  const goals = getMetric(player, "goals")?.value ?? 0;
  const assists = getMetric(player, "assists")?.value ?? 0;
  const matchesPlayed = getMetric(player, "matchesPlayed")?.value ?? 0;

  const summary = [
    `${player.name} is a ${bio.ageYears ?? "—"}-year-old ${foot} ${position} from ${bio.country ?? "unknown"}, currently at ${extras.currentClub}.`,
    rating != null
      ? `Rated ${rating.toFixed(1)} this season with ${goals} goal${goals === 1 ? "" : "s"} and ${assists} assist${assists === 1 ? "" : "s"} across ${matchesPlayed} appearances.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const distance = getMetric(player, "distance");
  const topSpeed = getMetric(player, "topSpeed");
  const sprints = getMetric(player, "sprints");
  const lastName = player.name.split(" ").slice(-1)[0];

  const physicalNotes = [
    distance ? `covered ${formatMetricValue("distance", distance.value)} km` : null,
    topSpeed ? `hit a top speed of ${formatMetricValue("topSpeed", topSpeed.value)} km/h` : null,
    sprints ? `recorded ${sprints.value} sprint${sprints.value === 1 ? "" : "s"}` : null,
  ].filter((note): note is string => Boolean(note));

  const recentForm =
    physicalNotes.length > 0
      ? `In the most recently tracked match, ${lastName} ${physicalNotes.join(", ")} — real numbers from our tracker, not estimated.`
      : "No tracked match data is available yet for this player.";

  return { summary, recentForm };
}
