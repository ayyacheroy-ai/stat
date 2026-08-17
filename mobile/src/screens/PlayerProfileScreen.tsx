import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { endpoints } from "../api/client";
import type { Player } from "../api/types";
import type { RootStackParamList } from "../navigation";
import { StatCard } from "../components/StatCard";

type Props = NativeStackScreenProps<RootStackParamList, "PlayerProfile">;

export function PlayerProfileScreen({ route }: Props) {
  const { playerId } = route.params;
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    endpoints.player(playerId).then(setPlayer);
  }, [playerId]);

  if (!player) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        {player.firstName} {player.lastName}
      </Text>
      <Text style={styles.team}>{player.team?.name ?? "Free agent"}</Text>

      <FlatList
        horizontal
        data={[
          { label: "Sport", value: player.sport },
          { label: "Ext. ID", value: player.externalId },
        ]}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.statRow}
        renderItem={({ item }) => <StatCard label={item.label} value={item.value} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 16 },
  empty: { color: "#8792A6", textAlign: "center", marginTop: 40 },
  name: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  team: { color: "#8792A6", marginTop: 2, marginBottom: 16 },
  statRow: { gap: 10 },
});
