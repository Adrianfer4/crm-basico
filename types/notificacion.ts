export type Notificacion = {
  id: string;
  idEvento: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  userId: string;
  estado: "pendiente" | "completado" | "cancelado";
  createdAt: string;
  prev: string;
  notificationId: string;
};
