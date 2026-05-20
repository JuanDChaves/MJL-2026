export interface IPedido {
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
  Entregado = "entregado",
  Editando = "editando"
}
