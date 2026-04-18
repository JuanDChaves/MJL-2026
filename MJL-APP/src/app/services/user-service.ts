import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './local-storage-service';
import { IUser } from '../interfaces/IUsers';
import { DbService } from './db-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private sbServ = inject(SupabaseService);
  dbService = inject(DbService)

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

  async userExist(identifiacion:string): Promise<boolean>{
    return await this.dbService.userExist(identifiacion);
  }
}