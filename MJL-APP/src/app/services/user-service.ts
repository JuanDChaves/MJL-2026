import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './local-storage-service';
import { IUserToRegister } from '../interfaces/IUserToRegister';
import { DbService } from './db-service';
import { IUserUnauthorizedToRegister } from '../interfaces/IUserUnauthorizedToRegister';
import { IUser } from '../interfaces/IUser';
import { IResult } from '../interfaces/IResult';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private sbServ = inject(SupabaseService);
  dbService = inject(DbService);

  isLogged = toSignal(this.sbServ.loggedIn$, { initialValue: false });
  private storageServ = inject(LocalStorageService);
  userData = signal<IUser | null>(null);

  async loadUserData(): Promise<void> {
    const data = await this.storageServ.getData<IUser>('user');
    this.userData.set(data);
  }

  clearUserData(): void {
    this.userData.set(null);
  }

  async userExist(identifiacion: string): Promise<boolean> {
    return await this.dbService.userExist('usuarios', identifiacion);
  }

  async loadUserAuthorization(
    user: IUserUnauthorizedToRegister
  ): Promise<{ data: any | null; error: any }> {
    const response = await this.dbService.insert('solicitudes', user);
    if (response.error) {
      console.log(response.error);
      return { data: null, error: response.error };
    }
    return { data: response.data, error: null };
  }

  async getUnauthorizedUsers(): Promise<{ data: any | null; error: any }> {
    const response = await this.dbService.getAll('solicitudes');
    if (response.error) {
      console.log(response.error);
      return { data: null, error: response.error };
    }
    return { data: response.data?.filter((sol) => sol.estado), error: null };
  }

  async enableOrRejectUser(identifiacion: string, enable: boolean) {
    const response = await this.dbService.update(
      'usuarios',
      'dni',
      identifiacion,
      { activo: enable }
    );

    const response_req = await this.dbService.update(
      'solicitudes',
      'dni',
      identifiacion,
      { estado: false }
    )
  }

  async insert(user: IUserToRegister) : Promise<IResult<IUser>>{
    const {data: registeredUser, error: loadError} = await this.dbService.insert(
        'usuarios',
        user
      );
    const result :IResult<IUser>={
      success : false,
      data: null,
      error: null
    }  
    if(loadError){
      result.error = {message: 'Error al inserte usuario' }
      return result;
    }
    result.data = registeredUser;
    result.success = true;
    return result
  }

}
