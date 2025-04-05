// app/register.tsx
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
      });

      setVisible(true);
      setTimeout(() => router.replace("/(protected)/(tabs)"), 1000);
    } catch (err: any) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseError = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "El correo ya está registrado";
      case "auth/invalid-email":
        return "Correo electrónico inválido";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres";
      default:
        return "Error en el registro";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        label="Nombre completo"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        textColor="#fff"
        theme={{ colors: { primary: "#4caf50", background: "#1f1f1f" } }}
      />

      <TextInput
        label="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        style={styles.input}
        textColor="#fff"
        theme={{ colors: { primary: "#4caf50", background: "#1f1f1f" } }}
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        textColor="#fff"
        theme={{ colors: { primary: "#4caf50", background: "#1f1f1f" } }}
      />

      <TextInput
        label="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        textColor="#fff"
        theme={{ colors: { primary: "#4caf50", background: "#1f1f1f" } }}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {loading ? "Registrando..." : "Crear Cuenta"}
      </Button>

      <Button
        mode="text"
        onPress={() => router.push("/login")}
        style={styles.linkButton}
        labelStyle={styles.linkLabel}
      >
        ¿Ya tienes cuenta? Inicia Sesión
      </Button>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={800}
        style={styles.snackbar}
        theme={{ colors: { surface: "#4caf50", accent: "#fff" } }}
      >
        <Text style={styles.snackbarText}>Registro exitoso</Text>
      </Snackbar>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1f1f1f",
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 5,
    backgroundColor: "#4caf50",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 15,
  },
  linkLabel: {
    color: "#4caf50",
  },
  errorText: {
    color: "#ff4444",
    marginBottom: 10,
    textAlign: "center",
  },
  snackbar: {
    backgroundColor: "#ff9800",
  },
  snackbarText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
