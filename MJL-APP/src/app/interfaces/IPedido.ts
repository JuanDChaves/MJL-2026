import { BaseEntity } from "../services/db-service";

export interface IPedido extends BaseEntity {
  id: string,
  mesa: string;
  id_cliente: string,
  nombre_cliente: string;
  estado: EstadoPedido
}

export enum EstadoPedido {
  Pendiente = "pendiente",
  Preparando = "preparando",
  Hecho = "hecho",
  Entregado = "entregado"
}
