export interface IUser {
  user_id: string|null;
  apellidos: string;
  nombres: string;
  correo_electronico: string;
  perfil: string;
  activo: boolean;
  url_foto_perfil: string | null;
  identificacion: string
};