import { IUser } from "./IUser";

export interface IMesaCliente {
  id:string
  numero_mesa: number;
  ocupada:boolean
  cliente: IUser | null;
}