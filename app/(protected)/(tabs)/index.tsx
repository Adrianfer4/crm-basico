import { Pressable, View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import DashboardCard from "@/components/DashboardCard";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { obtenerClientes,  } from "@/firebase/clientes";
import { obtenerVentasHoy } from "@/firebase/ventas";
import { obtenerTareasPendientes } from "@/firebase/eventos";
import { useAuth } from "@/context/AuthContext";

export default function DashboardScreen() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [tareasPendientes, setTareasPendientes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const cargarDatos = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
  
      if (!user) return;

      const [clientes, ventas, tareas] = await Promise.all([
        obtenerClientes(),
        obtenerVentasHoy(user.uid),
        obtenerTareasPendientes(user.uid),
      ]);

      setTotalClientes(clientes.length);
      setVentasHoy(ventas);
      setTareasPendientes(tareas);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [user?.uid]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const onRefresh = useCallback(() => {
    cargarDatos(true);
  }, [cargarDatos]);
  
  if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋</Text>

      <ScrollView contentContainerStyle={styles.cardsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]} 
            tintColor="#4CAF50" 
          />
        }
        >

      <Pressable
          onPress={() => router.push("/(protected)/ventas")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
        <DashboardCard
          title="Ventas hoy"
          value={`$ ${ventasHoy.toFixed(2)}`}
          icon="cash-multiple"
          color="#4caf50"
        />
        </Pressable>
        <Pressable
          onPress={() => router.push("/(protected)/clientes")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed, 
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
          value={tareasPendientes.toString()}
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
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
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
