import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public client: SupabaseClient;
  private supabaseUrl: string = 'https://tvoosqcbxhokrluyettu.supabase.co';
  private supabaseKey: string =
    'sb_publishable_QMF_gsDju6hlgnPWvx-K-g_Tm58WyjE';
  private loggedIn = signal<boolean>(false);
  public readonly loggedIn$ = toObservable(this.loggedIn);
  private email = signal<string>('');
  public readonly email$ = toObservable(this.email);

  constructor() {
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
    this.initListen();
  }

  private initListen(): void {
    this.client.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('SIGNED_IN')
        this.loggedIn.set(true);
        this.email.set(session.user.email??'');
      } else if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT')
        this.loggedIn.set(false);
        this.email.set('');
      }
    });
  }
}
