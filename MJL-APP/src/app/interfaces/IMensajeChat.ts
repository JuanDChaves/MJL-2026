export interface IMensajeChat {
  id: string;
  mesa_id: string;
  user_id: string;
  mensaje: string;
  created_at: string;
  leido: boolean;
  nombre_mozo: string | null;
}
