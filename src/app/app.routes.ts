import { Routes } from '@angular/router';

import { Home } from './pages/usuario/home/home';
import { Productos } from './pages/usuario/productos/productos';

import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Productos as ProductosAdmin } from './pages/admin/productos/productos';

import { Login } from './pages/usuario/login/login';

export const routes: Routes = [

  // ==========================================
  // PÚBLICO
  // ==========================================

  {
    path: '',
    component: Home
  },

  {
    path: 'productos',
    component: Productos
  },

  {
    path: 'login',
    component: Login
  },



  // ==========================================
  // ADMIN
  // ==========================================

  {
    path: 'admin',
    component: Dashboard,
    children: [

      {
        path: 'productos',
        component: ProductosAdmin
      }

      // Más adelante:
      //
      // {
      //   path: 'categorias',
      //   component: Categorias
      // },
      //
      // {
      //   path: 'tallas',
      //   component: Tallas
      // },
      //
      // {
      //   path: 'empleados',
      //   component: Empleados
      // }

    ]
  }

];