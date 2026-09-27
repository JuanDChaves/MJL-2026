import { IUser } from "./IUser";

export interface IMesaCliente {
  id:string
  numero_mesa: number;
  ocupada:boolean
  cliente: IUser | null;
  cantidad_comensales: number;
  url_foto_mesa: string;
  url_qr: string;
}