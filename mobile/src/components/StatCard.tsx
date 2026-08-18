import { StyleSheet, Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 72,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#141C2E",
    alignItems: "center",
  },
  value: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    color: "#8792A6",
    fontSize: 11,
    marginTop: 2,
    textTransform: "uppercase",
  },
});
