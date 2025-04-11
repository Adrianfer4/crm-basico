export type Evento = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  createdAt: string;
  userId: string;
  clienteId?: string;
  notificationId?: string;
  [key: string]: any;
};