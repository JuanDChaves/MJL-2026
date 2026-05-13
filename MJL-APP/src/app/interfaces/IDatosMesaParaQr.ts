import { TipoMesa } from "../types/TipoMesa";

export interface IDatosMesaParaQr {
  numero_mesa: number;
  tipo_mesa: TipoMesa;
  cantidad_comensales: number;
  url_foto_mesa: string;
}