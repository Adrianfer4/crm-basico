import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  title: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
};

export default function DashboardCard({
  title,
  value,
  icon,
  color = "#6200ee",
}: Props) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <MaterialCommunityIcons name={icon} size={32} color={color} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    gap: 12,
    marginBottom: 14
  },
  title: {
    fontSize: 16,
    color: "#ccc",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
