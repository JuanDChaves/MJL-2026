export interface IUserUnauthorized {
  apellidos: string;
  nombres: string;
  identificacion: string;
  estado: boolean|null;
  url_foto_perfil: string | null;
  fecha_registro: Date|null;
};
