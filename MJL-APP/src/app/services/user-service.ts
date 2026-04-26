import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './local-storage-service';
import { IUser } from '../interfaces/IUsers';
import { DbService } from './db-service';
import { IUserUnauthorized } from '../interfaces/IUserUnauthorized';

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
    user: IUserUnauthorized
  ): Promise<{ data: any | null; error: any }> {
    const response = await this.dbService.insert('solicitudes', { apellidos: user.apellidos, nombres: user.nombres, identificacion: user.identificacion });
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
      'identificacion',
      identifiacion,
      { estado: false }
    )
  }
}
