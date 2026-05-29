import { IUser } from "./IUser";

export interface ClienteEnEspera{
    en_espera: boolean;
    id_lista_espera: string;
    mesa_id: string;
    cliente: IUser;
}