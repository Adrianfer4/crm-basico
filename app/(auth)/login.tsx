// app/login.tsx
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      case "auth/invalid-email":
        return "Correo electrónico inválido";
      case "auth/user-not-found":
        return "Usuario no registrado";
      case "auth/wrong-password":
        return "Contraseña incorrecta";
      default:
        return "Error al iniciar sesión";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>

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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {loading ? "Cargando..." : "Iniciar Sesión"}
      </Button>

      <Button
        mode="text"
        onPress={() => router.push("/register")}
        style={styles.linkButton}
        labelStyle={styles.linkBabel}
      >
        ¿No tienes cuenta? Regístrate
      </Button>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={800}
        style={styles.snackbar}
        theme={{ colors: { surface: "#4caf50", accent: "#fff" }}}
      >
        <Text style={styles.snackbarText}>Login exitoso</Text>
      </Snackbar>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    justifyContent: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center"
  },
  input: {
    backgroundColor: "#1f1f1f",
    marginBottom: 15,
    borderRadius: 8
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 5,
    backgroundColor: "#4caf50",
  },
  buttonLabel: {
    color:"#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  linkButton: {
    marginTop: 15
  },
  linkBabel: {
    color: "#4caf50"
  },
  errorText: {
    color: "#ff4444",
    marginBottom: 10,
    textAlign: "center"
  },
  snackbar: {
    backgroundColor: "#ff9800",
  },
  snackbarText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
