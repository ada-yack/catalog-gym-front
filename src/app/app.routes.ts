import { Routes } from '@angular/router';

import { Home } from './pages/usuario/home/home';
import { Productos } from './pages/usuario/productos/productos';

import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Productos as ProductosAdmin } from './pages/admin/productos/productos';

import { Login } from './pages/usuario/login/login';
import { Registro } from './pages/usuario/registro/registro';
import { adminGuard } from './core/guards/admin-guard';
import { Tallas } from './pages/admin/tallas/tallas';
import {Categorias  } from './pages/admin/categorias/categorias';


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
  
  {
  path: 'registro',
  component: Registro
},

  // 🛒 CARRITO
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/usuario/carrito/carrito')
        .then(m => m.Carrito)
  },


  // ==========================================
  // ADMIN
  // ==========================================

  {
    path: 'admin',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [

      {
        path: 'productos',
        component: ProductosAdmin
      },
      {
        path: 'tallas',
        component: Tallas
      },
      {
         path: 'categorias',
        component: Categorias
      },

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