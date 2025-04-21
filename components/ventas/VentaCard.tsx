import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Venta } from "@/types/venta";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  venta: Venta;
  clientesMap: Record<string, string>;
  onPress: () => void;
};

export default function VentaCard({ venta, clientesMap, onPress }: Props) {
  const estadoConfig = {
    pendiente: { color: "#FFD33D", icon: "clock" as const },
    pagado: { color: "#4CAF50", icon: "check-circle" as const },
    cancelado: { color: "#F44336", icon: "close-circle" as const },
  };

  const nombreCliente =
    clientesMap[venta.clienteId!] || "Cliente no encontrado";
  const { color, icon } = estadoConfig[venta.estado!] || {
    color: "#9E9E9E",
    icon: "help-circle" as const,
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.title}>
        <View>
          <Text style={styles.clienteNombre}>Cliente: {nombreCliente}</Text>
        </View>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>

      <Text style={styles.descripcion}>{venta.descripcion}</Text>

      <View style={styles.footer}>
        <Text style={styles.total}>${venta.total.toFixed(2)}</Text>
        <View style={[styles.estadoPill, { backgroundColor: color + "33" }]}>
          <Text style={[styles.estadoText, { color }]}>
            {venta.estado?.toUpperCase() || "DESCONOCIDO"}
          </Text>
        </View>
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
    borderLeftWidth: 4,
    elevation: 2,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clienteNombre: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
  },
  descripcion: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
  },
  estadoPill: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
