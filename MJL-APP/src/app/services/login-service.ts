import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  
  private sbServ = inject(SupabaseService);  

  async initSession(email: string, pass: string): Promise<any> {
    const response = await this.sbServ.client.auth.signInWithPassword({email: email, password: pass});
    return response;
  }
  async closeSession(): Promise<any> {
    const response = await this.sbServ.client.auth.signOut();
    console.log('cierre de session')
    return response;
  }
  
  async createAccount(
    email: string, 
    pass: string,    
  ): Promise<any> {
    const response = await this.sbServ.client.auth.signUp({
      email: email,
      password: pass
    })
    return response;
  }
  
}
