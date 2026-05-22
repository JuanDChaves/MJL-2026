import { TipoMesa } from "../types/TipoMesa";

export interface IMesaACargar {
  numero_mesa: number;
  tipo_mesa: TipoMesa;
  cantidad_comensales: number;
  url_foto_mesa: string;
  url_qr: string;
  ocupada:boolean
  dni: string | null;
}