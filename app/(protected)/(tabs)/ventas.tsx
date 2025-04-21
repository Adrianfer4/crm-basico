import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerVentasPorUsuario,
  crearVenta,
  eliminarVenta,
  actualizarVenta,
} from "@/firebase/ventas";
import { obtenerClientes } from "@/firebase/clientes";
import CrearVentaModal from "@/components/ventas/NuevoVentaModal";
import SwipeableNotification from "@/components/notificaciones/SwipeableNotification";
import ModalEditarVenta from "@/components/ventas/ModalEditarVenta";
import VentaCard from "@/components/ventas/VentaCard";
import { Venta, Cliente } from "@/types/venta";
import { FAB } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function VentasScreen() {
  const { user } = useAuth();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(
    null
  );
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCrear, setOpenCrear] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      if (!user?.uid) return;
      setLoading(true);

      const [ventasData, clientesData] = await Promise.all([
        obtenerVentasPorUsuario(user.uid),
        obtenerClientes(),
      ]);

      setVentas(ventasData as Venta[]);
      setClientes(clientesData as Cliente[]);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clientesMap = useMemo(
    () =>
      clientes.reduce((acc: Record<string, string>, cliente) => {
        if (cliente.id) acc[cliente.id] = cliente.nombre;
        return acc;
      }, {}),
    [clientes]
  );

  const handleCrearVenta = async (data: {
    clienteId: string;
    descripcion: string;
    total: number;
  }) => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      await crearVenta({
        ...data,
        userId: user.uid,
      } as Venta);

      Toast.show({
        type: "success",
        text1: "Venta creada",
        text2: "Se guardó correctamente",
      });

      setOpenCrear(false);
      await fetchData();
    } catch (error) {
      console.error("Error creando venta:", error);

      Toast.show({
        type: "error",
        text1: "Error creando venta",
        text2: "Revisa los campos e inténtalo de nuevo",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarVenta = async (id: string) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar esta venta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarVenta(id);
              setVentas((prev) => prev.filter((v) => v.id !== id));

              Toast.show({ type: "success", text1: "Venta eliminada" });
              await fetchData();
            } catch (error) {
              Toast.show({ type: "error", text1: "Error eliminando venta" });
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ventas</Text>

      <FlatList
        data={ventas}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <SwipeableNotification
            onDelete={() => item.id && handleEliminarVenta(item.id)}
          >
            <VentaCard
              venta={item}
              clientesMap={clientesMap}
              onPress={() => {
                setVentaSeleccionada(item);
                setModalEditarVisible(true);
              }}
            />
          </SwipeableNotification>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes ventas aún.</Text>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        theme={{ colors: { accent: "#4CAF50" } }}
        onPress={() => setOpenCrear(true)}
      />

      <CrearVentaModal
        visible={openCrear}
        clientes={clientes}
        clienteSeleccionado={clienteSeleccionado}
        onSelectCliente={setClienteSeleccionado}
        onSubmit={handleCrearVenta}
        onClose={() => {
          setOpenCrear(false);
          setClienteSeleccionado(null);
          fetchData();
        }}
      />

      <ModalEditarVenta
        visible={modalEditarVisible}
        clientes={clientes}
        clienteSeleccionado={clienteSeleccionado}
        onSelectCliente={setClienteSeleccionado}
        onClose={() => setModalEditarVisible(false)}
        venta={ventaSeleccionada!}
        onSubmit={async (data) => {
          if (!ventaSeleccionada?.id) return;
          try {
            await actualizarVenta(ventaSeleccionada.id, data);
            await fetchData();
            setModalEditarVisible(false);
            Toast.show({ type: "success", text1: "Venta actualizada" });
          } catch (error) {
            Toast.show({ type: "error", text1: "Error actualizando venta" });
          }
        }}
      />
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
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: "#4caf50",
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
