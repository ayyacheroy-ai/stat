export type Sport = "BASKETBALL" | "FOOTBALL";

export interface Team {
  id: string;
  sport: Sport;
  externalId: string;
  name: string;
}

export interface Player {
  id: string;
  sport: Sport;
  externalId: string;
  firstName: string;
  lastName: string;
  team?: Team | null;
}

export interface Game {
  id: string;
  sport: Sport;
  externalId: string;
  playedAt: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
}

export interface GameStat {
  id: string;
  playerId: string;
  player: Player;
  teamId: string;
  team: Team;
  minutesPlayed: number | null;
  metrics: Record<string, number>;
}

export interface GameDetail extends Game {
  stats: GameStat[];
  awards: PlayerAward[];
}

export interface Award {
  id: string;
  key: string;
  name: string;
  description: string;
  sport: Sport;
}

export interface PlayerAward {
  id: string;
  award: Award;
  player: Player;
  game?: Game | null;
  awardedAt: string;
  value: Record<string, number> | null;
}

export interface Competition {
  id: string;
  sport: Sport;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  participants: { id: string; score: number; player: Player }[];
}
