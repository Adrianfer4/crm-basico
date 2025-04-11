import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from "react";
import { crearEvento } from "@/firebase/eventos";
import { obtenerClientes } from "@/firebase/clientes";
import { Evento } from "@/types/evento";
import { Cliente } from "@/types/venta";
import { auth } from "@/config/firebaseConfig";
import ModalSelectCliente from "./ModalSelectCliente"; 

type NuevoEventoModalProps = {
  visible: boolean;
  onClose: () => void;
  fecha: string;
  onEventoCreado: (nuevoEvento: Evento) => void;
};

export default function NuevoEventoModal({
  visible,
  onClose,
  fecha,
  onEventoCreado,
}: NuevoEventoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [hora, setHora] = useState("");
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);
  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalClientesVisible, setModalClientesVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const traerClientes = async () => {
      try {
        const data = await obtenerClientes();
        setClientes(data);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los clientes");
      }
    };
    traerClientes();
  }, []);

  const handleGuardar = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert("Error", "Debes estar autenticado para crear eventos");
      return;
    }

    if (!titulo.trim() || !hora.trim()) {
      Alert.alert("Campos obligatorios", "Título y hora son requeridos");
      return;
    }

    setLoading(true);
    try {
      const nuevoEvento = await crearEvento({
        titulo,
        descripcion,
        fecha,
        hora,
        clienteId: clienteId || undefined,
      }, { uid: user.uid });

      onEventoCreado(nuevoEvento);
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el evento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setHora("");
    setClienteId("");
    setClienteNombre("");
  };

  const handleSeleccionarCliente = (cliente: Cliente) => {
    if (cliente.id) {
      setClienteId(cliente.id);
      setClienteNombre(cliente.nombre);
    }
  };

  const parsearHora = () => {
    if (!hora) return new Date();
    const [horas, minutos] = hora.split(":");
    const fecha = new Date();
    fecha.setHours(parseInt(horas), parseInt(minutos));
    return fecha;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Nuevo Evento</Text>

          <TextInput
            placeholder="Título *"
            placeholderTextColor="#777"
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
          />

          <TextInput
            placeholder="Descripción"
            placeholderTextColor="#777"
            style={[styles.input, styles.multilineInput]}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setMostrarTimePicker(true)}
          >
            <Text style={{ color: hora ? "#fff" : "#777" }}>
              {hora || "Hora *"}
            </Text>
          </TouchableOpacity>

          {mostrarTimePicker && (
            <DateTimePicker
              mode="time"
              value={parsearHora()}
              display="spinner"
              onChange={(_, date) => {
                setMostrarTimePicker(false);
                if (date) {
                  const horas = date.getHours().toString().padStart(2, "0");
                  const minutos = date.getMinutes().toString().padStart(2, "0");
                  setHora(`${horas}:${minutos}`);
                }
              }}
              textColor="#fff"
            />
          )}

          <TouchableOpacity
            style={styles.selectCliente}
            onPress={() => setModalClientesVisible(true)}
          >
            <Text style={{ color: clienteNombre ? "#fff" : "#777" }}>
              {clienteNombre || "Seleccionar Cliente (opcional)"}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleGuardar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ModalSelectCliente
          visible={modalClientesVisible}
          onClose={() => setModalClientesVisible(false)}
          clientes={clientes}
          onSelect={handleSeleccionarCliente}
        />
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
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    lineHeight: 20,
  },
  selectCliente: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
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
    flexDirection: "row",
    gap: 8,
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