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
    path: 'pedidos-preparados',
    loadComponent: () =>
      import(
        './components/pedidos/predidos-preparados/predidos-preparados.component'
      ).then((m) => m.PredidosPreparadosComponent),
  },
  {
    path: 'detalle-pedido/:id',
    loadComponent: () => 
      import(
        './components/pedidos/detalle-pedido/detalle-pedido.component'
      ).then((m) => m.DetallePedidoComponent)
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
  },
  {
    path: 'ingreso-local-cliente',
    loadComponent: () =>
      import('./components/Home/home-cliente/pantalla-ingreso-local/pantalla-ingreso-local.component').then(
        (m) => m.PantallaIngresoLocalComponent
      ),
  },
  {
    path:'menu-clientes',
    loadComponent: () =>
      import('./components/Home/home-cliente/pantalla-menu-cliente/pantalla-menu-cliente.component').then(
        (m) => m.PantallaMenuClienteComponent
      ),
  },
  {
    path:'lista-espera',
    loadComponent: () =>
      import('./components/Home/home-metre/lista-espera/lista-espera.component').then(
        (m) => m.ListaEsperaComponent
      ),
  },
  {
    path:'encuesta',
    loadComponent: () =>
      import('./components/encuesta/encuesta.component').then(
        (m) => m.EncuestaComponent
      ),
  },
  {
    path:'ver-encuesta',
    loadComponent: () =>
      import('./components/Home/home-cliente/graficos-encuesta/graficos-encuesta.component').then(
        (m) => m.GraficosEncuestaComponent
      ),
  },
  {
    path:'mayor-menor',
    loadComponent: () =>
      import('./components/juegos/mayor-menor/mayor-menor.component').then(
        (m) => m.MayorMenorComponent
      ),
  },
  {
    path:'ruleta',
    loadComponent: () =>
      import('./components/juegos/ruleta/ruleta.component').then(
        (m) => m.RuletaComponent
      ),
  },
  {
    path: 'ahoracado',
    loadComponent: () =>
      import('./components/juegos/ahorcado/ahorcado.component').then(
        (m) => m.AhorcadoComponent
      )
  },
  {
    path:'juegos',
    loadComponent: () =>
      import('./components/juegos/pantalla-juegos/pantalla-juegos.component').then(
        (m) => m.PantallaJuegosComponent
      ),
  },
  {
    path: 'propinas',
    loadComponent: () => 
      import('./components/propinas/propinas.component').then(
        (m) => m.PropinasComponent
      )
  }
];
