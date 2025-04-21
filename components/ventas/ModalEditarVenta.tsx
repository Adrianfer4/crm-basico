import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import ModalSelectCliente from "@/components/cliente/ModalSelectCliente";
import { Cliente, Venta } from "@/types/venta";

type Props = {
  visible: boolean;
  clientes: Cliente[];
  venta: Venta;
  clienteSeleccionado: Cliente | null;
  onSelectCliente: (cliente: Cliente) => void;
  onClose: () => void;
  onSubmit: (data: {
    clienteId: string;
    descripcion: string;
    total: number;
    estado: Venta["estado"];
  }) => void;
};

export default function ModalEditarVenta({
  visible,
  clientes,
  venta,
  clienteSeleccionado,
  onSelectCliente,
  onClose,
  onSubmit,
}: Props) {
  const [clienteId, setClienteId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [total, setTotal] = useState("");
  const [estado, setEstado] = useState<Venta["estado"]>("pendiente");
  const [modalClienteVisible, setModalClienteVisible] = useState(false);

  useEffect(() => {
    if (venta) {
      setClienteId(venta.clienteId || "");
      setDescripcion(venta.descripcion);
      setTotal(venta.total.toString());
      setEstado(venta.estado);
    }
  }, [venta]);

  const handleGuardar = () => {
    if (!descripcion || !total) return;
    onSubmit({
      clienteId: clienteSeleccionado?.id || "",
      descripcion,
      total: parseFloat(total),
      estado,
    });
  };

  const obtenerNombreCliente = () => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nombre : "Seleccionar cliente";
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Editar Venta</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setModalClienteVisible(true)}
          >
            <Text style={styles.inputText}>{obtenerNombreCliente()}</Text>
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

          <Text style={{ color: "#fff", marginBottom: 8 }}>Estado:</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            {["pendiente", "pagado", "cancelado"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setEstado(item as Venta["estado"])}
                style={[
                  styles.estadoButton,
                  estado === item && styles.estadoButtonActivo,
                ]}
              >
                <Text style={{ color: "#fff" }}>{item.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={{ color: "#fff" }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSave} onPress={handleGuardar}>
              <Text style={{ color: "#fff" }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ModalSelectCliente
          visible={modalClienteVisible}
          clientes={clientes}
          onClose={() => setModalClienteVisible(false)}
          onSelect={(cliente) => {
            onSelectCliente(cliente);
            setModalClienteVisible(false);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: "#fff",
  },
  inputText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  estadoButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#444",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  estadoButtonActivo: {
    backgroundColor: "#4caf50",
  },
  buttonCancel: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  buttonSave: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
});
