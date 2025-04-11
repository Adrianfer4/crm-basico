// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const handleError = (errorCode: string) => {
    const errors = {
      "auth/invalid-email": "Correo electrónico inválido",
      "auth/user-not-found": "Usuario no registrado",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/email-already-in-use": "El correo ya está registrado",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
      "auth/too-many-requests": "Demasiados intentos, intente más tarde"
    };
    
    return errors[errorCode as keyof typeof errors] || "Error de autenticación";
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(protected)/(tabs)");
    } catch (error: any) {
      setError(handleError(error.code));
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(protected)/(tabs)");
    } catch (error: any) {
      setError(handleError(error.code));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error: any) {
      setError("Error al cerrar sesión");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}