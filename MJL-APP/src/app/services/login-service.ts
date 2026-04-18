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

  async createUserViaEdgeFunction(
    email: string,
    password: string
  ): Promise<{ userId: string | null; error: any }> {
    try {
      const { data, error } = await this.sbServ.client.functions.invoke('create-user', {
        body: { email, password },
      });

      if (error) {
        return { userId: null, error: { message: error.message || 'Error al crear usuario' } };
      }

      const response = data as any;

      if (response.success === false) {
        return { userId: null, error: { message: response.error || 'Error al crear usuario' } };
      }

      if (!response.success || !response.user_id) {
        return { userId: null, error: { message: 'Error al crear usuario' } };
      }

      return { userId: response.user_id, error: null };
    } catch (err: any) {
      console.error('Edge Function exception:', err);
      return { userId: null, error: { message: err.message || 'Error de conexión' } };
    }
  }
  
}