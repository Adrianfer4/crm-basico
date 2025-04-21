import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", style: "destructive", 
          onPress: () => {
            logout();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="account-circle" size={100} color="#4caf50" />
      <Text style={styles.name}>{user?.displayName || "Usuario"}</Text>
      <Text style={styles.email}>{user?.email}</Text> 
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
