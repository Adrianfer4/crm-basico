import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";

type Props = {
  titulo: string;
  fechaHora: string;
  estado: "pendiente" | "completado" | "cancelado";
  onCambiarEstado: (nuevoEstado: Props["estado"]) => void;
};

const colorMap = {
  pendiente: "#FFD33D",
  completado: "#4CAF50",
  cancelado: "#F44336",
};

export default function NotificacionesCard({
  titulo = "Sin título",
  fechaHora = "Fecha no disponible",
  estado = "pendiente",
  onCambiarEstado,
}: Props) {
  const scales = useRef({
    pendiente: new Animated.Value(1),
    completado: new Animated.Value(1),
    cancelado: new Animated.Value(1),
  }).current;

  const handlePressIn = (estadoKey: keyof typeof colorMap) => {
    Animated.spring(scales[estadoKey], {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (estadoKey: keyof typeof colorMap) => {
    Animated.spring(scales[estadoKey], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onCambiarEstado(estadoKey);
  };

  return (
    <View style={[styles.card, { borderLeftColor: colorMap[estado] }]}>
      <MaterialCommunityIcons name="bell" size={32} color={colorMap[estado]} />

      <View style={styles.content}>
        <Text style={styles.titulo}>{titulo}</Text>

        <View style={styles.fechaContainer}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={16}
            color="#888"
          />
          <Text style={styles.fechaHora}>{fechaHora}</Text>
        </View>

        <View style={styles.botonesContainer}>
          {Object.keys(colorMap).map((estadoKey) => {
            const key = estadoKey as keyof typeof colorMap;
            const isActive = estado === key;

            return (
                <Animated.View key={key} style={{ transform: [{ scale: scales[key] }] }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPressIn={() => handlePressIn(key)}
                  onPressOut={() => handlePressOut(key)}
                  style={[
                    styles.boton,
                    { backgroundColor: isActive ? colorMap[key] : "#6B7280" },
                  ]}
                >
                  <Text style={styles.botonTexto}>{key}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    elevation: 3,
    marginVertical: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  titulo: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  fechaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  fechaHora: {
    marginLeft: 4,
    color: "#888",
  },
  botonesContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  boton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  iconoCheck: {
    marginLeft: 6,
  },
});
