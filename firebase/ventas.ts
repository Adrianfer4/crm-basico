import { db } from "@/config/firebaseConfig";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Venta } from "@/types/venta";

export async function obtenerVentasHoy(userId: string): Promise<number> {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    const q = query(
      collection(db, "ventas"),
      where("userId", "==", userId),
      where("createdAt", ">=", hoy),
      where("createdAt", "<", manana)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.reduce((total, doc) => total + doc.data().total, 0);
  } catch (error) {
    console.error("Error obteniendo ventas:", error);
    return 0;
  }
}

// Obtener ventas de un usuario
export async function obtenerVentasPorUsuario(userId: string): Promise<Venta[]> {
  try {
    const ventasRef = collection(db, "ventas");
    const q = query(ventasRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Venta[];
  } catch (error) {
    console.error("Error obteniendo ventas:", error);
    throw new Error("Error al cargar ventas");
  }
}

// Crear venta
export async function crearVenta(venta: Omit<Venta, "id" | "createdAt">) {
  const ventasRef = collection(db, "ventas");
  const docRef = await addDoc(ventasRef, {
    ...venta,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, ...venta };
}

// Actualizar venta
export async function actualizarVenta(id: string, data: Partial<Omit<Venta, "id" | "createdAt">>) {
  const ventaRef = doc(db, "ventas", id);
  await updateDoc(ventaRef, data);
}

// Eliminar venta
export async function eliminarVenta(id: string) {
  const ventaRef = doc(db, "ventas", id);
  await deleteDoc(ventaRef);
}
