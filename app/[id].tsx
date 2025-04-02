import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { removeClient, updateClient } from "../store/clientsSlice";
import { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams(); // Obtiene el ID de la URL
  const client = useSelector((state: RootState) =>
    state.clients.find((c) => c.id === id)
  );
  const dispatch = useDispatch();
  const router = useRouter();

  // Estados locales para editar
  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [notes, setNotes] = useState(client?.notes || "");
  const [visible, setVisible] = useState(false);

  if (!client) return null; // Evita errores si el cliente no existe

  const handleUpdate = () => {
    dispatch(updateClient({ id, name, email, phone, notes }));
    setVisible(true);
    setTimeout(() => router.push("/"), 1000);
  };

  <Snackbar
    visible={visible}
    onDismiss={() => setVisible(false)}
    duration={800}
  >
    Cliente actualizado con éxito.
  </Snackbar>;

  const handleDelete = () => {
    Alert.alert("Eliminar Cliente", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: () => {
          dispatch(removeClient(id as string));
          router.push("/"); // Regresa a la lista
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Notas"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={{ marginBottom: 8 }}
      />

      <Button
        mode="contained"
        onPress={handleUpdate}
        style={{ marginBottom: 16 }}
      >
        Guardar Cambios
      </Button>

      <Button mode="contained" buttonColor="red" onPress={handleDelete}>
        Eliminar Cliente
      </Button>
    </View>
  );
}
