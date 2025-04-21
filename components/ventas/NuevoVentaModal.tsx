import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState } from "react";
import ModalSelectCliente from "@/components/cliente/ModalSelectCliente";
import { Cliente } from "@/types/venta";

type Props = {
  visible: boolean;
  clientes: Cliente[];
  clienteSeleccionado: Cliente | null;
  onSelectCliente: (cliente: Cliente) => void;
  onSubmit: (data: {
    clienteId: string;
    descripcion: string;
    total: number;
  }) => void;
  onClose: () => void;
};

export default function CrearVentaModal({
  visible,
  clientes,
  clienteSeleccionado,
  onSelectCliente,
  onClose,
  onSubmit,
}: Props) {
  const [clienteId, setClienteId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [total, setTotal] = useState("");
  const [modalClienteVisible, setModalClienteVisible] = useState(false);

  const handleGuardar = () => {
    if (!clienteSeleccionado?.id || !descripcion || !total) return;
    onSubmit({
      clienteId: clienteSeleccionado.id,
      descripcion,
      total: parseFloat(total),
    });
    setDescripcion("");
    setTotal("");
    setClienteId("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Nueva Venta</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setModalClienteVisible(true)}
          >
            <Text style={{ color: clienteSeleccionado ? "#fff" : "#777" }}>
              {clienteSeleccionado?.nombre || "Seleccionar Cliente *"}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Descripción"
            placeholderTextColor="#777"
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          <TextInput
            placeholder="Total"
            placeholderTextColor="#777"
            style={styles.input}
            keyboardType="numeric"
            value={total}
            onChangeText={setTotal}
          />

          <ModalSelectCliente
            visible={modalClienteVisible}
            clientes={clientes}
            onClose={() => setModalClienteVisible(false)}
            onSelect={(cliente) => {
              onSelectCliente(cliente);
              setModalClienteVisible(false);
            }}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                (!clienteSeleccionado || !descripcion || !total) && {
                  opacity: 0.5,
                },
              ]}
              onPress={handleGuardar}
              disabled={!clienteSeleccionado || !descripcion || !total}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#1E1E1E",
    padding: 24,
    borderRadius: 12,
    width: "90%",
    maxWidth: 500,
    elevation: 5,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#2A2A2A",
    color: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#404040",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
