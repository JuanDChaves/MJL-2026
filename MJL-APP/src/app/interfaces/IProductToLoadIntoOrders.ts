export interface IProductToLoadIntoOrders {
  id_producto: string;
  nombre: string;
  cantidad: number;
  precio: number;
  tipo: 'plato' | 'bebida';
  tiempo_elaboracion: number;
  descripcion: string;
}
