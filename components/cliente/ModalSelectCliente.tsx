import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import { useState } from "react";
import { Cliente } from "@/types/venta";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  clientes: Cliente[];
  onSelect: (cliente: Cliente) => void;
};

export default function ModalSelectCliente({
  visible,
  onClose,
  clientes,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const filtrados = clientes?.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Seleccionar Cliente</Text>

          <TextInput
            placeholder="Buscar cliente..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />

          <FlatList
            data={filtrados}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                style={styles.item}
                android_ripple={{ color: "#333" }}
              >
                <MaterialCommunityIcons
                  name="account-circle"
                  size={24}
                  color="#4CAF50"
                />
                <Text style={styles.itemText}>{item.nombre}</Text>
              </Pressable>
            )}
            contentContainerStyle={styles.listContent}
          />

          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#121212",
    width: "90%",
    maxWidth: 500,
    maxHeight: "75%",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    backgroundColor: "#1E1E1E",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
  },
  close: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContent: {
    flexGrow: 1,
  },
});
