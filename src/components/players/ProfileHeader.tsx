"use client";

import { useState } from "react";
import type { Player } from "@/types/player";
import type { PlayerProfileExtras } from "@/types/profile";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getTeamColor, getTeamName } from "@/config/app-config";
import { cn } from "@/lib/cn";

/**
 * "Follow" is local UI state only — there's no backend to persist it,
 * matching the fake-auth spirit of this build stage.
 */
export function ProfileHeader({ player, extras }: { player: Player; extras: PlayerProfileExtras }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const first = extras.marketValueHistory[0]?.valueEur;
  const last = extras.marketValueHistory[extras.marketValueHistory.length - 1]?.valueEur;
  const changePercent = first ? ((last - first) / first) * 100 : 0;
  const showTrend = Math.abs(changePercent) >= 5;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {extras.currentClub} · #{player.bio.shirtNumber ?? "—"}
          </span>
          <h1 className="font-display text-3xl leading-none text-foreground">{player.name}</h1>
          <Badge label={getTeamName(player.teamId)} color={getTeamColor(player.teamId)} />
        </div>
        <Button
          variant={isFollowing ? "secondary" : "primary"}
          onClick={() => setIsFollowing((value) => !value)}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>

      {showTrend && (
        <div
          className={cn(
            "rounded-xl px-3 py-2 text-xs font-medium",
            changePercent > 0 ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger",
          )}
        >
          {changePercent > 0 ? "▲" : "▼"} Market value {changePercent > 0 ? "up" : "down"}{" "}
          {Math.abs(changePercent).toFixed(0)}% this season
        </div>
      )}
    </div>
  );
}
