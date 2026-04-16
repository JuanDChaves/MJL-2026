export interface IUser {
  id: string;
  apellidos: string;
  nombres: string;
  correo_electronico: string;
  perfil: string;
  activo: boolean;
  url_foto_perfil: string | null;
};

export interface IEmployee extends IUser {
    cuil: number
}

export interface IClient extends IUser{
  dni: number
}