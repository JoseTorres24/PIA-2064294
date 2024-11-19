import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { PublicGuard } from './services/public.guard'; // Asegúrate de importar el PublicGuard

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () =>
      import('./inicio/inicio.component').then((m) => m.InicioComponent),
    canActivate: [PublicGuard], // Protege la ruta pública
  },
  {
    path: 'crear-cuenta',
    loadComponent: () =>
      import('./crear-cuenta/crear-cuenta.component').then(
        (m) => m.CrearCuentaComponent
      ),
    canActivate: [PublicGuard], // Protege la ruta pública
  },
  {
    path: 'iniciar-sesion',
    loadComponent: () =>
      import('./iniciar-sesion/iniciar-sesion.component').then(
        (m) => m.IniciarSesionComponent
      ),
    canActivate: [PublicGuard], // Protege la ruta pública
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs.page').then((m) => m.TabsPage),
    canActivate: [AuthGuard], // Protege esta ruta privada
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('./tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('./tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('./tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
];
