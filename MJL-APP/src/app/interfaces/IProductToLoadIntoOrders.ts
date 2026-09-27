export interface IProductToLoadIntoOrders {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo_elaboracion: number;
  cantidad: number;
  tipo: 'plato' | 'bebida';
}
