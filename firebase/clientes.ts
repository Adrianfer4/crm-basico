import { db } from '@/config/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export type Cliente = {
  id?: string;
  nombre: string;
  email: string;
  telefono: string;
};

const ref = collection(db, 'clientes');

export const obtenerClientes = async () => {
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const crearCliente = async (cliente: Cliente) => {
  await addDoc(ref, cliente);
};
