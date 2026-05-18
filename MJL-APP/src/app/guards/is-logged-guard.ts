import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase-service';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage-service';
import { IUser } from '../interfaces/IUser';

export const isLoggedGuard: CanActivateFn = async (route, state) => {
  const sbServ = inject(SupabaseService);
  const router = inject(Router);
  const storageServ = inject(LocalStorageService);

  const result = await sbServ.client.auth.getSession();
  const user = await storageServ.getData<IUser>('user');

  // CASO 1: No está logueado → permitir acceso
  if (!result.data.session) {
    return true;
  }

  // CASO 2: Está logueado → verificar permisos
  const perfilesPermitidos = ['duenio', 'supervisor', 'metre'];

  if (user && perfilesPermitidos.includes(user.perfil)) {
    return true;
  }

  // CASO 3: Está logueado pero sin permisos → redirigir a home
  return router.navigate(['/home']);
};
