import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { actualizarCliente } from "@/firebase/clientes";
import { Cliente } from "@/types/venta";

type EditarClienteModalProps = {
  visible: boolean;
  onClose: () => void;
  cliente?: Cliente | null;
  onClienteActualizado: () => void;
};

export default function EditarClienteModal({
  visible,
  onClose,
  cliente,
  onClienteActualizado,
}: EditarClienteModalProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nota, setNota] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre);
      setEmail(cliente.email);
      setTelefono(cliente.telefono);
      setNota(cliente.nota || "");
    }
  }, [cliente, visible]);

  useEffect(() => {
    if (!visible) {
      setNombre("");
      setEmail("");
      setTelefono("");
      setNota("");
    }
  }, [visible]);

  const handleGuardar = async () => {
    if (!cliente?.id) return;

    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      Alert.alert("Error", "Nombre, email y teléfono son obligatorios");
      return;
    }

    setLoading(true);
    try {
      await actualizarCliente(cliente.id, {
        nombre,
        email,
        telefono,
        nota: nota || null,
      } as Cliente);
      onClienteActualizado();
      onClose();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el cliente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Editar Cliente</Text>

          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#777"
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Teléfono"
            placeholderTextColor="#777"
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Nota / Recordatorio (opcional)</Text>
          <TextInput
            placeholder="Ej: Le gusta pagar en efectivo, recordar su cumpleaños..."
            placeholderTextColor="#999"
            style={styles.stickyNote}
            value={nota}
            onChangeText={setNota}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleGuardar}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onClose()}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2c2c2c",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 12,
  },
  stickyNote: {
    backgroundColor: "#2c2c2c",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  label: {
    color: "#888",
    marginBottom: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: "#ccc",
    textAlign: "center",
  },
});
