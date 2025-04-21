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
  getDoc,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import * as Notifications from "expo-notifications";
import { crearNotificacion, eliminarNotificacion } from "./notificaciones";
import { Evento } from "@/types/evento";

export async function obtenerTareasPendientes(userId: string): Promise<number> {
  try {
    const hoy = new Date().toISOString().split("T")[0];
    const q = query(
      collection(db, "eventos"),
      where("userId", "==", userId),
      where("fecha", "==", hoy)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error obteniendo tareas:", error);
    return 0;
  }
}

export async function obtenerEventosPorFecha(fecha: string): Promise<Evento[]> {
  try {
    const eventosRef = collection(db, "eventos");
    const q = query(
      eventosRef,
      where("fecha", "==", fecha),
      orderBy("hora", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Evento)
    );
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    throw new Error("Error al cargar eventos");
  }
}

const programarNotificacion = async (
  titulo: string,
  cuerpo: string,
  fecha: Date
): Promise<string> => {
  const id = await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo },
    // @ts-ignore
    trigger: fecha,
  });
  return id;
};

export async function crearEvento(
  evento: {
    titulo: string;
    descripcion: string;
    fecha: string;
    hora: string;
    clienteId?: string;
  },
  user: { uid: string }
): Promise<Evento> {
  let notificationId: string | undefined;

  if (evento.hora) {
    const [hora, minutos] = evento.hora.split(":");
    const fechaNotificacion = new Date(
      `${evento.fecha}T${hora.padStart(2, "0")}:${minutos.padStart(2, "0")}:00`
    );

    notificationId = await programarNotificacion(
      "Tienes un evento pendiente",
      evento.titulo,
      fechaNotificacion
    );
  }

  const docRef = await addDoc(collection(db, "eventos"), {
    ...evento,
    userId: user.uid,
    notificationId,
    createdAt: new Date().toISOString(),
  });

  if (user.uid) {
    await crearNotificacion({
      idEvento: docRef.id,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      hora: evento.hora,
      userId: user.uid,
      estado: "pendiente",
      // @ts-ignore
      notificationId,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    id: docRef.id,
    ...evento,
    notificationId,
    userId: user.uid,
    createdAt: new Date().toISOString(),
  };
}

export async function eliminarEvento(id: string) {
  const eventoRef = doc(db, "eventos", id);
  const eventoSnap = await getDoc(eventoRef);

  if (eventoSnap.exists()) {
    const evento = eventoSnap.data() as Evento;

    if (evento.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        evento.notificationId
      );
    }

    await eliminarNotificacion(id);

    await deleteDoc(eventoRef);
  }
}

export async function actualizarEvento(id: string, data: Partial<Evento>) {
  const eventoRef = doc(db, "eventos", id);
  const eventoActual = (await getDoc(eventoRef)).data() as Evento;

  if (data.hora || data.fecha) {
    if (eventoActual.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        eventoActual.notificationId
      );
    }

    const fecha = data.fecha || eventoActual.fecha;
    const hora = data.hora || eventoActual.hora;
    const [h, m] = hora.split(":");
    const nuevaFecha = new Date(
      `${fecha}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`
    );

    data.notificationId = await programarNotificacion(
      "Evento actualizado",
      data.titulo || eventoActual.titulo,
      nuevaFecha
    );
  }

  await updateDoc(eventoRef, data);
}
