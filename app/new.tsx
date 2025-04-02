import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Snackbar } from "react-native-paper";
import { useDispatch } from "react-redux";
import { addClient } from "../store/clientsSlice";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";

export default function NewClientScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) return; // Validación simple

    dispatch(
      addClient({
        id: uuid.v4() as string,
        name,
        email,
        phone,
        notes,
      })
    );

    setVisible(true); // Muestra la alerta
    setTimeout(() => router.push('/'), 1000); // Redirige tras 1s
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

      <Button mode="contained" onPress={handleSave} style={{ marginTop: 16 }}>
        Guardar Cliente
      </Button>

      <Snackbar visible={visible} onDismiss={() => setVisible(false)} duration={800}>
        Cliente guardado con éxito.
      </Snackbar>
    </View>
  );
}
