import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './local-storage-service';
import { IUser } from '../interfaces/IUsers';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private sbServ = inject(SupabaseService);
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
}