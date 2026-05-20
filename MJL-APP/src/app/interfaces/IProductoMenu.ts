export interface IProductoMenu {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo_elaboracion: number;
  tipo: 'plato' | 'bebida';
  fotos: string[];
  cantidad: number;
}