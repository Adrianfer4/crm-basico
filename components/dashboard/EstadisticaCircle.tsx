import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  value: string | number;
  color?: string;
};

export default function EstadisticaCircle({ title, value, color = "#4caf50" }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { borderColor: color }]}>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    color: "#555",
  },
});
