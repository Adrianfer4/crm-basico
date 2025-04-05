import { Pressable, View, Text, ScrollView, StyleSheet } from "react-native";
import DashboardCard from "@/components/DashboardCard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { obtenerClientes } from "@/firebase/clientes";

export default function DashboardScreen() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const clientes = await obtenerClientes();
        setTotalClientes(clientes.length);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋</Text>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
      <Pressable
          onPress={() => router.push("/(protected)/agenda")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed, // Efecto al presionar
          ]}
        >
        <DashboardCard
          title="Ventas hoy"
          value="$ 420.00"
          icon="cash-multiple"
          color="#4caf50"
        />
        </Pressable>
        <Pressable
          onPress={() => router.push("/(protected)/agenda")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed, // Efecto al presionar
          ]}
        >
        <DashboardCard
          title="Clientes totales"
          value={loading ? "..." : totalClientes.toString()}
          icon="account-plus"
          color="#2196f3"
        />
        </Pressable>
        <Pressable
          onPress={() => router.push("/(protected)/agenda")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
        <DashboardCard
          title="Tareas pendientes"
          value="3"
          icon="calendar-clock"
          color="#ff9800"
        />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  cardsContainer: {
    gap: 16,
  },
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
