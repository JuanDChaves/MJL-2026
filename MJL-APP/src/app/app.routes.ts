import { Routes } from '@angular/router';
import { isLoggedGuard } from './guards/is-logged-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/login-form/login-form.component').then(
        (m) => m.LoginFormComponent,
      ),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login-form/login-form.component').then(
        (m) => m.LoginFormComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/registration-form/registration-form.component').then(
        (m) => m.RegistrationFormComponent,
      ),
    canActivate: [isLoggedGuard]
  },
];
