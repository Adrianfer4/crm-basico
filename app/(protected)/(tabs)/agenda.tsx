// screens/AgendaScreen.tsx
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Calendar, DateData  } from "react-native-calendars";
import { obtenerEventosPorFecha } from "@/firebase/eventos";
import { Evento } from "@/types/evento";
import NuevoEventoModal from "@/components/NuevoEventoModal";
import EditarEventoModal from "@/components/EditarEventoModal";
import { FAB } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function AgendaScreen() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);

  const obtenerEventos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerEventosPorFecha(fechaSeleccionada);
      setEventos(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar los eventos",
      });
    } finally {
      setLoading(false);
    }
  }, [fechaSeleccionada]);

  useEffect(() => {
    obtenerEventos();
  }, [obtenerEventos]);

  const handleEventoCreado = (evento: Evento) => {
    setEventos(prev => [...prev, evento]);
    setMostrarModal(false);
    Toast.show({
      type: "success",
      text1: "Evento creado",
      text2: "Se guardó correctamente",
    });
  };

  const handleEventoActualizado = () => {
    obtenerEventos();
    Toast.show({
      type: "success",
      text1: "Evento actualizado",
      text2: "Cambios guardados correctamente",
    });
  };

  const handleEventoEliminado = () => {
    obtenerEventos();
    Toast.show({
      type: "success",
      text1: "Evento eliminado",
      text2: "Se eliminó correctamente",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda</Text>

      <Calendar
        onDayPress={(day: DateData) => setFechaSeleccionada(day.dateString)} 
        markedDates={{
          [fechaSeleccionada]: {
            selected: true,
            selectedColor: "#4caf50",
            dots: eventos.length > 0 ? [{ color: "#4caf50" }] : [],
          },
        }}
        theme={{
          calendarBackground: "#1f1f1f",
          dayTextColor: "#fff",
          monthTextColor: "#fff",
          textDisabledColor: "#555",
          todayTextColor: "#4caf50",
          selectedDayBackgroundColor: "#4CAF50",
          arrowColor: "#fff",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
        }}
      />

      <Text style={styles.subtitle}>Eventos del día</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4caf50" />
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay eventos programados</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventoItem}
              onPress={() => setEventoSeleccionado(item)}
            >
              <View style={styles.eventoHeader}>
                <Text style={styles.eventoHora}>{item.hora}</Text>
                <Text style={styles.eventoTitulo}>{item.titulo}</Text>
              </View>
              {item.descripcion && (
                <Text style={styles.eventoDesc}>{item.descripcion}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        theme={{ colors: { accent: "#4CAF50" } }}
        onPress={() => setMostrarModal(true)}
      />

      <NuevoEventoModal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        fecha={fechaSeleccionada}
        onEventoCreado={handleEventoCreado}
      />

      <EditarEventoModal
        visible={!!eventoSeleccionado}
        onClose={() => setEventoSeleccionado(null)}
        evento={eventoSeleccionado}
        onEventoActualizado={handleEventoActualizado}
        onEventoEliminado={handleEventoEliminado}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 36,
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
    textAlign: "center"
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  eventoItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  eventoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventoTitulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  eventoHora: {
    color: "#4caf50",
    fontSize: 14,
    fontWeight: "500",
  },
  eventoDesc: {
    color: "#888",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: "#4caf50",
  },
});