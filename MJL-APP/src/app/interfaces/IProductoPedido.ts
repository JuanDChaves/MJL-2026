import { IPedido } from "./IPedido";
import { IProducto } from "./IProducto";

export interface IProductoPedido {
    id: string,
    cantidad: number,
    precio: number,
    id_pedido: string,
    id_producto: string,
    estado: EstadoProductoPedido,
    productos: IProducto

}

export enum EstadoProductoPedido {
    Preparando = "preparando",
    Hecho = "hecho"
}

export interface IPedidoConProductos extends IPedido {
    producto_pedido: IProductoPedido[];
}
