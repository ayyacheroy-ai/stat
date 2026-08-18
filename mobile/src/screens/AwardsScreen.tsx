import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { endpoints } from "../api/client";
import type { PlayerAward } from "../api/types";

export function AwardsScreen() {
  const [feed, setFeed] = useState<PlayerAward[]>([]);

  useEffect(() => {
    endpoints.awardsFeed().then(setFeed);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No awards yet — ingest a game to generate some.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>🏆 {item.award.name}</Text>
            <Text style={styles.subtitle}>
              {item.player.firstName} {item.player.lastName}
            </Text>
            <Text style={styles.description}>{item.award.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },
  list: { padding: 16, gap: 10 },
  empty: { color: "#8792A6", textAlign: "center", marginTop: 40 },
  row: { backgroundColor: "#141C2E", borderRadius: 12, padding: 14, gap: 4 },
  title: { color: "#F5C451", fontSize: 15, fontWeight: "700" },
  subtitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  description: { color: "#8792A6", fontSize: 12 },
});
