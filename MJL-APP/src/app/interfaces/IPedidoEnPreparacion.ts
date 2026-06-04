
export interface IPedidoEnPreparacion {
  id_pedido: string;
  numero_mesa: number;
  fecha_hora: string;  // ISO timestamp
  productos: Array<{ id: string; nombre: string; cantidad: number }>;
  total_items: number;
}