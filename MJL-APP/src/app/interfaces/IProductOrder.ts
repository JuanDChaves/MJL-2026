import { TypeOrderState } from "../types/TypeOrderState";
import { IProductoMenu } from "./IProductoMenu";

export interface IProductOrderToLoad{
  id_pedido:string
  lista_productos: IProductoMenu[],
  estado: TypeOrderState,
}