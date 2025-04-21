import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  orderBy,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Notificacion } from "@/types/notificacion";

export async function crearNotificacion(data: Omit<Notificacion, "id">) {
  try {
    const notificacionesRef = collection(db, "notificaciones");
    const docRef = await addDoc(notificacionesRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creando notificación:", error);
    throw new Error("Error al crear notificación");
  }
}

export const obtenerNotificacionesPorUsuario = async (userId: string) => {
  try {
    const notificacionesRef = collection(db, "notificaciones");
    const q = query(
      notificacionesRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notificacion[];
  } catch (error) {
    console.error("Error en obtenerNotificacionesPorCliente:", error);
    throw new Error("Error al obtener las notificaciones");
  }
};

export async function actualizarEstadoNotificacion(
  id: string,
  estado: "pendiente" | "completado" | "cancelado"
) {
  try {
    const notificacionRef = doc(db, "notificaciones", id);
    await updateDoc(notificacionRef, { estado });
  } catch (error) {
    console.error("Error actualizando estado:", error);
    throw new Error("Error al actualizar estado");
  }
}

export async function eliminarNotificacion(idEvento: string) {
  try {
    const notificacionesRef = collection(db, "notificaciones");
    const q = query(notificacionesRef, where("idEvento", "==", idEvento));
    const snapshot = await getDocs(q);

    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error eliminando notificación:", error);
  }
}

export const onNotificacionesSnapshot = (
  userId: string,
  callback: (notificaciones: Notificacion[]) => void,
  errorCallback: (error: Error) => void
) => {
  const q = query(
    collection(db, "notificaciones"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Notificacion)
      );
      callback(data);
    },
    (error) => errorCallback(error)
  );
};
