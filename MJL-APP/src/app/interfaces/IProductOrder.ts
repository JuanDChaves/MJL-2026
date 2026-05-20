import { TypeOrderState } from "../types/TypeOrderState";
import { ICutProducto } from "./ICutProducto";

export interface IProductOrderToLoad{
  p_id_pedido:string
  p_productos: ICutProducto[],
  p_estado: TypeOrderState,
}