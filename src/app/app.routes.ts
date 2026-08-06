import { Routes } from '@angular/router';
import { Home } from './pages/usuario/home/home';
import { Productos } from './pages/admin/productos/productos';


export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'productos',
    component: Productos
  }

];
