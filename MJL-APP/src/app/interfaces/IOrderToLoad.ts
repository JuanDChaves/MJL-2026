import { TypeOrderState } from "../types/TypeOrderState";

export interface IOrderToLoad {
  id_cliente:string,
  nombre_cliente:string,
  estado: TypeOrderState,
  numero_mesa:number
}