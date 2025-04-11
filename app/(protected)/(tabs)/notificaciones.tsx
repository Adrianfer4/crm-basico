import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  Platform, 
  UIManager 
} from "react-native";
import {
  obtenerNotificacionesPorUsuario,
  actualizarEstadoNotificacion, 
  onNotificacionesSnapshot
} from "@/firebase/notificaciones";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NotificacionesCard from "@/components/NotificacionesCard";
import SwipeableNotification from '@/components/SwipeableNotification';
import { eliminarNotificacion } from '@/firebase/notificaciones';
import { Notificacion } from "@/types/notificacion";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NotificacionesScreen() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchNotificaciones = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
  
      setError("");
  
      if (!user?.uid) throw new Error("Usuario no autenticado");
  
      const data = await obtenerNotificacionesPorUsuario(user.uid);
  
      setNotificaciones(data?.filter(Boolean) || []);
    } catch (err: any) {
      setError(err.message || "Error cargando notificaciones");
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    
    const unsubscribe = onNotificacionesSnapshot(user.uid, (nuevasNotificaciones) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNotificaciones(nuevasNotificaciones);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleCambiarEstado = async (id: string, nuevoEstado: "pendiente" | "completado" | "cancelado") => {
    try {
      if (!id) throw new Error("ID de notificación inválido");
      await actualizarEstadoNotificacion(id, nuevoEstado as any);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNotificaciones((prev: Notificacion[]) => 
        prev.map((item) =>
          item.id === id ? { ...item, estado: nuevoEstado } : item
        )
      );

    } catch {
      setError("Error actualizando estado");
    }
  };

  const handleEliminarNotificacion = async (id: string) => {
    try {
      await eliminarNotificacion(id);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNotificaciones(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      setError("Error eliminando notificación");
    }
  };

  // Filtrar notificaciones del día actual
  const filteredNotificaciones = notificaciones.filter(item => {
    const today = new Date().toISOString().split('T')[0];
    return item.fecha === today;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="alert-circle" size={40} color="#F44336" />
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <FlatList
        data={filteredNotificaciones}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          if (!item) return null;

          return (
            <SwipeableNotification onDelete={() => item.id && handleEliminarNotificacion(item.id)}>
              <NotificacionesCard
                titulo={item.titulo || "Sin título"}
                fechaHora={
                  item.fecha && item.hora
                    ? new Date(`${item.fecha}T${item.hora}`).toLocaleDateString(
                        "es-ES",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Fecha no disponible"
                }
                estado={item.estado || "pendiente"}
                onCambiarEstado={(nuevoEstado) =>
                  item.id && handleCambiarEstado(item.id, nuevoEstado)
                }
              />
            </SwipeableNotification>
          );
        }}
        contentContainerStyle={styles.lista}
        refreshing={refreshing}
        onRefresh={() => fetchNotificaciones(true)}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <MaterialCommunityIcons name="bell-off" size={60} color="#ccc" />
            <Text style={styles.sinNoti}>No tienes notificaciones hoy</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  error: {
    color: "#F44336",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  vacio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  sinNoti: {
    color: "#888",
    fontSize: 16,
    marginTop: 16,
  },
});