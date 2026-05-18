export interface IUser {
  id: string;
  apellidos: string;
  nombres: string;
  correo_electronico: string;
  perfil: string;
  activo: boolean;
  url_foto_perfil: string | null;
  dni: string;
  cuil: string|null
};