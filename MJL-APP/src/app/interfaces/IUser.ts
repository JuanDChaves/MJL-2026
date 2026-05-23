export interface IUser {
  id: string;
  apellidos: string | null ;
  nombres: string;
  correo_electronico: string | null;
  perfil: string;
  activo: boolean;
  url_foto_perfil: string | null;
  dni: string | null;
  cuil: string|null
};