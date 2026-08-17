import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { endpoints } from "../api/client";
import type { GameDetail } from "../api/types";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "GameSummary">;

export function GameSummaryScreen({ route }: Props) {
  const { gameId } = route.params;
  const [game, setGame] = useState<GameDetail | null>(null);

  useEffect(() => {
    endpoints.game(gameId).then(setGame);
  }, [gameId]);

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {game.homeTeam.name} {game.homeScore} — {game.awayScore} {game.awayTeam.name}
      </Text>

      {game.awards.length > 0 && (
        <View style={styles.awardsBanner}>
          {game.awards.map((a) => (
            <Text key={a.id} style={styles.awardText}>
              🏆 {a.player.firstName} {a.player.lastName} — {a.award.name}
            </Text>
          ))}
        </View>
      )}

      <FlatList
        data={game.stats}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.statRow}>
            <Text style={styles.playerName}>
              {item.player.firstName} {item.player.lastName}
            </Text>
            <Text style={styles.metrics}>
              {Object.entries(item.metrics)
                .slice(0, 4)
                .map(([k, v]) => `${k}: ${v}`)
                .join("  ·  ")}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },
  header: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", padding: 16 },
  empty: { color: "#8792A6", textAlign: "center", marginTop: 40 },
  awardsBanner: { paddingHorizontal: 16, paddingBottom: 8, gap: 4 },
  awardText: { color: "#F5C451", fontSize: 13, fontWeight: "600" },
  list: { paddingHorizontal: 16, gap: 8, paddingBottom: 24 },
  statRow: { backgroundColor: "#141C2E", borderRadius: 10, padding: 12, gap: 4 },
  playerName: { color: "#FFFFFF", fontWeight: "600" },
  metrics: { color: "#8792A6", fontSize: 12 },
});
