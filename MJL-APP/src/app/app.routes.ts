import { Routes } from '@angular/router';
import { isLoggedGuard } from './guards/is-logged-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/login-form/login-form.component').then(
        (m) => m.LoginFormComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login-form/login-form.component').then(
        (m) => m.LoginFormComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/registration-form/registration-form.component').then(
        (m) => m.RegistrationFormComponent
      ),
    canActivate: [isLoggedGuard],
  },
  {
    path: 'customer-auth-panel',
    loadComponent: () =>
      import(
        './components/Home/home-supervisor/customer-auth-panel/customer-auth-panel.component'
      ).then((m) => m.CustomerAuthPanelComponent),
  },
  {
    path: 'mozo-home-page',
    loadComponent: () =>
      import(
        './components/Home/home-mozo/mozo-home-page/mozo-home-page.component'
      ).then((m) => m.MozoHomePageComponent),
  },
  {
    path: 'pedidos-pendientes',
    loadComponent: () =>
      import(
        './components/pedidos/pedidos-pendientes/pedidos-pendientes.component'
      ).then((m) => m.PedidosPendientesComponent),
  },
  {
    path: 'pedidos-en-preparacion',
    loadComponent: () =>
      import(
        './components/pedidos/pedidos-en-preparacion/pedidos-en-preparacion.component'
      ).then((m) => m.PedidosEnPreparacionComponent),
  },
  {
    path: 'chat-room',
    loadComponent: () =>
      import('./components/chat-room/chat-room.component').then(
        (m) => m.ChatRoomComponent
      ),
  },
  {
    path: 'pagos',
    loadComponent: () =>
      import('./components/Home/home-mozo/pagos/pagos.component').then(
        (m) => m.PagosComponent
      ),
  },
  {
    path: 'home-cocinero',
    loadComponent: () =>
      import('./components/Home/home-cocinero/home-cocinero.page').then(
        (m) => m.HomeCocineroPage
      ),
  },
  {
    path: 'home-cantinero',
    loadComponent: () =>
      import('./components/Home/home-cantinero/home-cantinero.page').then(
        (m) => m.HomeCantineroPage
      ),
  },
  {
    path: 'alta-producto',
    loadComponent: () =>
      import('./components/alta-producto/alta-producto.component').then(
        (m) => m.AltaProductoComponent
      ),
  },
  {
    path: 'agregar-mesa',
    loadComponent: () =>
      import('./components/agregar-mesa-form/agregar-mesa-form.component').then(
        (m) => m.AgregarMesaFormComponent
      ),
  },
  {
    path:'home-cliente',
    loadComponent: () =>
      import('./components/Home/home-cliente/home-cliente.component').then(
        (m) => m.HomeClienteComponent
      ),
  },
  {path: 'verificar-pedido',
    loadComponent: () => 
      import('./components/verificar-pedido/verificar-pedido.component').then(
        (m) => m.VerificarPedidoComponent
      ),
  },
  {path: 'entregar-pedido',
    loadComponent: () => 
      import('./components/entregar-pedido/entregar-pedido.component').then(
        (m) => m.EntregarPedidoComponent
      ),
  }
];
