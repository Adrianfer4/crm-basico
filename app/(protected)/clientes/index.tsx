import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import ClienteCard from "@/components/cliente/ClienteCard";
import { Ionicons } from "@expo/vector-icons";
import { obtenerClientes, eliminarCliente } from "@/firebase/clientes";
import { Text } from "react-native-paper";
import NuevoClienteModal from "@/components/cliente/NuevoClienteModal";
import EditarClienteModal from "@/components/cliente/EditarClienteModal";
import { Cliente } from "@/types/venta";
import SwipeableNotification from "@/components/notificaciones/SwipeableNotification";
import Toast from "react-native-toast-message";

export default function IndexClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const cargarClientes = async () => {
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error cargando clientes",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    cargarClientes();
  };

  const handleEliminarCliente = (id: string) => {
    Alert.alert("Eliminar Cliente", "¿Estás seguro de eliminar este cliente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarCliente(id);
            setClientes((prev) => prev.filter((c) => c.id !== id));
            Toast.show({
              type: "success",
              text1: "Cliente eliminado",
              text2: "El cliente se eliminó correctamente",
            });
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "No se pudo eliminar el cliente",
            });
          }
        },
      },
    ]);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Lista de Clientes
      </Text>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4caf50"]}
            tintColor="#4caf50"
          />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#4caf50"
              style={styles.loading}
            />
          ) : (
            <Text style={styles.emptyText}>No hay clientes registrados</Text>
          )
        }
        renderItem={({ item }) => (
          <SwipeableNotification
            onDelete={() => handleEliminarCliente(item.id)}
          >
            <ClienteCard
              cliente={item}
              onPress={() => {
                setSelectedCliente(item);
                setEditModalVisible(true);
              }}
            />
          </SwipeableNotification>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <NuevoClienteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onClienteCreado={() => {
          cargarClientes();
          Toast.show({
            type: "success",
            text1: "Cliente creado",
            text2: "El cliente se registró correctamente",
          });
        }}
      />

      <EditarClienteModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedCliente(null);
        }}
        cliente={selectedCliente}
        onClienteActualizado={() => {
          cargarClientes();
          Toast.show({
            type: "success",
            text1: "Cliente actualizado",
            text2: "Los cambios se guardaron correctamente",
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingTop: 60,
  },
  listContent: {
    paddingBottom: 80,
    paddingHorizontal: 8,
  },
  loading: {
    marginTop: 40,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4caf50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
