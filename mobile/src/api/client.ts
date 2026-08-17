import axios from "axios";
import Constants from "expo-constants";
import type { Award, Competition, Game, GameDetail, Player, PlayerAward } from "./types";

const apiBaseUrl = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? "http://localhost:4000";

export const api = axios.create({ baseURL: apiBaseUrl });

export const endpoints = {
  games: () => api.get<Game[]>("/api/games").then((r) => r.data),
  game: (id: string) => api.get<GameDetail>(`/api/games/${id}`).then((r) => r.data),
  players: (sport?: string) =>
    api.get<Player[]>("/api/players", { params: sport ? { sport } : undefined }).then((r) => r.data),
  player: (id: string) => api.get<Player>(`/api/players/${id}`).then((r) => r.data),
  awards: () => api.get<Award[]>("/api/awards").then((r) => r.data),
  awardsFeed: () => api.get<PlayerAward[]>("/api/awards/feed").then((r) => r.data),
  competitions: () => api.get<Competition[]>("/api/competitions").then((r) => r.data),
};
