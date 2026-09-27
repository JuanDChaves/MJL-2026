import { TipoMesa } from "../types/TipoMesa";

export interface IMesa {
  id:string;
  numero_mesa: number;
  tipo_mesa: TipoMesa;
  ocupada:boolean
  user_id: string | null;
  cantidad_comensales: number;
  url_foto_mesa: string;
  url_qr: string;
}