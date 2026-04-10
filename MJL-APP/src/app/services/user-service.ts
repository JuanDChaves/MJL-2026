import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private sbServ = inject(SupabaseService);
  isLogged = toSignal( this.sbServ.loggedIn$, { initialValue: false } ); 
  
}
