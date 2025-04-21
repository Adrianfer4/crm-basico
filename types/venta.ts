export type Venta = {
  id?: string;
  clienteId?: string;
  descripcion: string;
  total: number;
  estado?: "pendiente" | "pagado" | "cancelado";
  fecha: string;
  hora: string;
  userId: string;
  createdAt?: Date;
};

export type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  nota: string;
  avatarUrl: string;
};
