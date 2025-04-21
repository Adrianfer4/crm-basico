import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  LayoutAnimation,
} from "react-native";
import { suscribirAVentasEnTiempoReal } from "@/firebase/ventas";
import EstadisticaCircle from "@/components/dashboard/EstadisticaCircle";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { obtenerClientes } from "@/firebase/clientes";
import { obtenerEventosPorFecha } from "@/firebase/eventos";
import { Evento } from "@/types/evento";
import { Cliente } from "@/types/venta";
import { Venta } from "@/types/venta";
import { useAuth } from "@/context/AuthContext";

export default function DashboardScreen() {
  const { user } = useAuth();
  const [totalClientes, setTotalClientes] = useState(0);
  const [ventasHoy, setVentasHoy] = useState<Venta[]>([]);
  const [montoTotal, setMontoTotal] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const cargarDatos = useCallback(async () => {
    try {
      const hoy = new Date().toISOString().split("T")[0];
      
      const [clientesData, eventosData] = await Promise.all([
        obtenerClientes(),
        obtenerEventosPorFecha(hoy),
      ]);

      setTotalClientes(clientesData.length);
      setClientes(clientesData.slice(-3).reverse());
      setTotalEventos(eventosData.length);
      setEventos(eventosData.slice(0, 3));
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Error al cargar datos iniciales");
    }
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
  
    let unsubscribe: () => void;
  
    const iniciarSuscripcionVentas = () => {
      try {
        unsubscribe = suscribirAVentasEnTiempoReal(
          user.uid,
          (nuevasVentas) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setVentasHoy(nuevasVentas);
            
            const total = nuevasVentas.reduce((sum, venta) => sum + venta.total, 0);
            setMontoTotal(total);
          },
          (error) => {
            console.error("Error ventas:", error);
            setError("Error cargando ventas");
          }
        );
      } catch (err) {
        console.error("Error en suscripción:", err);
      }
    };
  
    iniciarSuscripcionVentas();
    return () => unsubscribe?.();
  }, [user?.uid]);

  useEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}
    style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋</Text>

      {/* Estadisticas */}
      <View style={styles.statsContainer}>
        <EstadisticaCircle
          title="Clientes"
          value={totalClientes}
          color="#4caf50"
        />
        <EstadisticaCircle
          title="Ventas Hoy"
          value={montoTotal}
  
          color="#ff9800"
        />
        <EstadisticaCircle
          title="Eventos"
          value={totalEventos}
          color="#2196f3"
        />
      </View>

      {/* Próximos Eventos */}
      <Text style={styles.sectionTitle}>Próximos Eventos</Text>
      {eventos.length === 0 ? (
        <Text style={styles.emptyText}>No hay eventos para hoy.</Text>
      ) : (
        eventos.map((evento, index) => (
          <DashboardCard
            key={index}
            title={evento.titulo}
            value={evento.hora}
            icon="calendar"
            color="#2196f3"
          />
        ))
      )}

      <Text style={styles.sectionTitle}>Últimas Ventas</Text>
      {ventasHoy.length === 0 ? (
        <Text style={styles.emptyText}>No hay ventas recientes</Text>
      ) : (
        ventasHoy.slice(0, 3).map((venta) => (
          <DashboardCard
            key={venta.id}
            title={`${venta.descripcion}`}
            value={`$${venta.total} | ${venta.estado || 'Pendiente'}`}
            icon="cash"
            color="#ff9800"
          />
        ))
      )}

      <Text style={styles.sectionTitle}>Últimos Clientes</Text>
      {clientes.length === 0 ? (
        <Text style={styles.emptyText}>No hay clientes recientes.</Text>
      ) : (
        clientes.map((cliente, index) => (
          <DashboardCard
            key={index}
            title={cliente.nombre}
            value={cliente.telefono || "Sin número"}
            icon="account"
            color="#4caf50"
          />
        ))
      )}

      <Pressable onPress={() => router.push("/clientes")}>
        <Text style={styles.link}>Ir a Clientes →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 40, 
    paddingTop: 20
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#ccc",
    paddingLeft: 8,
  },
  emptyText: {
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  link: {
    color: "#4caf50",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 30,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});