import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { endpoints } from "../api/client";
import type { Competition } from "../api/types";

export function CompetitionsScreen() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    endpoints.competitions().then(setCompetitions);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={competitions}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No competitions yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.participants.length} players competing</Text>
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
  name: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  meta: { color: "#8792A6", fontSize: 12 },
});
