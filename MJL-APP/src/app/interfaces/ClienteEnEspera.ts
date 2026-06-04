import { IUser } from "./IUser";

export interface ClienteEnEspera{
    en_espera: boolean;
    id: string;
    mesa_id: string;
    cliente: IUser;
}