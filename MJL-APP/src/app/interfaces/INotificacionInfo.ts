export interface INotificacionInfo {
  title: string;
  body: string;
  data: { cliente_id: string|null; tipo: string };
}
