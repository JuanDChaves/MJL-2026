import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase-service';
import { inject } from '@angular/core';

export const isLoggedGuardGuard: CanActivateFn = async (route, state) => {
  const sbServ = inject(SupabaseService);
  const router = inject(Router);
  const result = await sbServ.client.auth.getSession();
  let metre = 'cocinero';
  const isLogged = false;
  return !isLogged || isLogged && (metre === 'metre' || metre === 'duenio' || metre === 'supervisor') ? true : router.navigate(['login']);
};
