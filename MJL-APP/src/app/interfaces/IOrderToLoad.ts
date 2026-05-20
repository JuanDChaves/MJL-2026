import { TypeOrderState } from "../types/TypeOrderState";
import { IProductToLoadIntoOrders } from "./IProductToLoadIntoOrders";

export interface IOrderToLoad {
  id_cliente:string,
  nombre_cliente:string,
  estado: TypeOrderState,
  numero_mesa:number,
  data: IProductToLoadIntoOrders[]
}