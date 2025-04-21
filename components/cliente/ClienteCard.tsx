import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Cliente } from "@/types/venta";

export type Props = {
  cliente: Cliente;
  onPress: () => void;
};

export default function ClienteCard({ cliente, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="account-circle"
          size={32}
          color="#4CAF50"
        />
        <Text style={styles.nombre}>{cliente.nombre}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.text}>📧 {cliente.email}</Text>
        <Text style={styles.text}>📱 {cliente.telefono}</Text>
        {cliente.nota && <Text style={styles.nota}>🗒️ {cliente.nota}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  nombre: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
    paddingTop: 12,
  },
  text: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 6,
  },
  nota: {
    color: "#888888",
    fontStyle: "italic",
    marginTop: 8,
  },
});
