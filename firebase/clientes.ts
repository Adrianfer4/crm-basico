import { db } from "@/config/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Cliente } from "@/types/venta";

const ref = collection(db, "clientes");

export const obtenerClientes = async (): Promise<Cliente[]> => {
  const ref = collection(db, "clientes");

  const snapshot = await getDocs(ref);

  return snapshot.docs.map(
    (doc: QueryDocumentSnapshot): Cliente => ({
      id: doc.id,
      nombre: doc.get("nombre") || "",
      email: doc.get("email") || "",
      telefono: doc.get("telefono") || "",
      nota: doc.get("nota") || "",
      avatarUrl: doc.get("avatarUrl") || "",
    })
  );
};

export const crearCliente = async (cliente: Cliente) => {
  await addDoc(ref, cliente);
};

export const actualizarCliente = async (id: string, cliente: Cliente) => {
  await updateDoc(doc(db, "clientes", id), cliente);
};

export const eliminarCliente = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "clientes", id));
};
