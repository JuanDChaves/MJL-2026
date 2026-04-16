import { effect, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './local-storage-service';
import { IClient, IEmployee, IUser } from '../interfaces/IUsers';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private sbServ = inject(SupabaseService);
  isLogged = toSignal( this.sbServ.loggedIn$, { initialValue: false } ); 
  storageServ = inject(LocalStorageService);  
  userData = signal<IUser | null>(null)

  constructor() {
    effect(() => {
      if (this.isLogged()) {
        this.loadUserData();
      }
    });
  }

  async loadUserData(): Promise<void> {
     this.userData.set(await this.storageServ.getData<IUser>('user'));
  }
  
}
