import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase-service';
import { inject } from '@angular/core';

export const isLoggedGuardGuard: CanActivateFn = async (route, state) => {
  const sbServ = inject(SupabaseService);
  const router = inject(Router);
  const result = await sbServ.client.auth.getSession();
  return true;
};
