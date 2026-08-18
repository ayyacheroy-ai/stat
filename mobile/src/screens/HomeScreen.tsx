import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { endpoints } from "../api/client";
import type { Game } from "../api/types";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endpoints
      .games()
      .then(setGames)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>No games ingested yet.</Text> : null
        }
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => navigation.navigate("GameSummary", { gameId: item.id })}>
            <View style={styles.teamLine}>
              <Text style={styles.teamName}>{item.homeTeam.name}</Text>
              <Text style={styles.score}>{item.homeScore}</Text>
            </View>
            <View style={styles.teamLine}>
              <Text style={styles.teamName}>{item.awayTeam.name}</Text>
              <Text style={styles.score}>{item.awayScore}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },
  list: { padding: 16, gap: 10 },
  empty: { color: "#8792A6", textAlign: "center", marginTop: 40 },
  row: {
    backgroundColor: "#141C2E",
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  teamLine: { flexDirection: "row", justifyContent: "space-between" },
  teamName: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  score: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
