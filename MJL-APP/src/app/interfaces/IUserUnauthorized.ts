export interface IUserUnauthorized {
  apellidos: string;
  nombres: string;
  dni: string;
  estado: boolean|null;
  url_foto_perfil: string | null;
  fecha_registro: Date|null;
  correo_electronico:string;
};
