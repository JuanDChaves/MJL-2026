import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { toSignal } from '@angular/core/rxjs-interop';

export type UserProfile = {
  id: string;
  user_id: string;
  apellidos: string;
  nombres: string;
  cuil: number;
  correo_electronico: string;
  perfil: string;
  activo: boolean;
  url_foto_perfil: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private sbServ = inject(SupabaseService);
  isLogged = toSignal( this.sbServ.loggedIn$, { initialValue: false } ); 
  
}
