// components/EditarEventoModal.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useEffect } from "react";
import { actualizarEvento, eliminarEvento } from "@/firebase/eventos";
import { obtenerClientes } from "@/firebase/clientes";
import ModalSelectCliente from "@/components/cliente/ModalSelectCliente";
import { Cliente } from "@/types/venta";

type EditarEventoModalProps = {
  visible: boolean;
  onClose: () => void;
  evento: any;
  onEventoActualizado: () => void;
  onEventoEliminado: () => void;
};

export default function EditarEventoModal({
  visible,
  onClose,
  evento,
  onEventoActualizado,
  onEventoEliminado,
}: EditarEventoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [hora, setHora] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);
  const [modalClientesVisible, setModalClientesVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (evento) {
      setTitulo(evento.titulo);
      setDescripcion(evento.descripcion);
      setHora(evento.hora);
      setClienteId(evento.clienteId || "");
    }
  }, [evento]);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await obtenerClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };
    cargarClientes();
  }, []);

  const obtenerNombreCliente = () => {
    if (clienteId === "") return "Ninguno";
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nombre : "Seleccionar cliente";
  };

  const parsearHora = () => {
    if (!hora) return new Date();
    const [horas, minutos] = hora.split(":");
    const fecha = new Date();
    fecha.setHours(parseInt(horas), parseInt(minutos));
    return fecha;
  };

  const handleGuardar = async () => {
    if (!titulo.trim() || !hora.trim()) {
      Alert.alert("Campos obligatorios", "Título y hora son requeridos");
      return;
    }

    try {
      setLoading(true);
      await actualizarEvento(evento.id, {
        titulo,
        descripcion,
        hora,
        clienteId,
      });
      onEventoActualizado();
      onClose();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el evento");
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarCliente = (cliente: Cliente) => {
    setClienteId(cliente.id || "");
    setModalClientesVisible(false);
  };

  const handleEliminar = async () => {
    try {
      setLoading(true);
      await eliminarEvento(evento.id);
      onEventoEliminado();
      onClose();
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Editar Evento</Text>

          <TextInput
            style={styles.input}
            placeholder="Título"
            placeholderTextColor="#666"
            value={titulo}
            onChangeText={setTitulo}
          />

          <TextInput
            style={[styles.input, styles.descripcion]}
            placeholder="Descripción"
            placeholderTextColor="#666"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setMostrarTimePicker(true)}
          >
            <Text style={styles.inputText}>{hora || "Seleccionar hora"}</Text>
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
            style={styles.input}
            onPress={() => setModalClientesVisible(true)}
          >
            <Text style={styles.inputText}>{obtenerNombreCliente()}</Text>
          </TouchableOpacity>

          <ModalSelectCliente
            visible={modalClientesVisible}
            onClose={() => setModalClientesVisible(false)}
            clientes={[
              {
                id: "",
                nombre: "Ninguno",
                email: "",
                telefono: "",
                nota: "",
                avatarUrl: "",
              } as Cliente,
              ...clientes,
            ]}
            onSelect={handleSeleccionarCliente}
          />

          <View style={styles.buttonContainer}>
            <View style={styles.mainButtons}>
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
                  loading && styles.disabledButton,
                ]}
                onPress={handleGuardar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Guardar Cambios</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.deleteContainer}>
              <TouchableOpacity
                style={[styles.botonEliminar, loading && styles.disabledButton]}
                onPress={() => {
                  Alert.alert(
                    "Eliminar Evento",
                    "¿Estás seguro que deseas eliminar este evento?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: loading ? "Eliminando..." : "Eliminar",
                        style: "destructive",
                        onPress: handleEliminar,
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.textoEliminar}>Eliminar Evento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
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
  inputText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  descripcion: {
    minHeight: 100,
    textAlignVertical: "top",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 16,
    marginTop: 16,
    width: "100%",
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    width: "100%",
  },
  deleteContainer: {
    alignItems: "center",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#404040",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  botonEliminar: {
    backgroundColor: "#ff4d4f",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  textoEliminar: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
