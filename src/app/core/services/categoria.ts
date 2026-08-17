import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Categoria } from '../../models/categoria';
import { CategoriaCreate } from '../../models/categoria-create';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private http = inject(HttpClient);

  private api = '/api/categorias';




  listCategorias(): Observable<Categoria[]>{

    return this.http.get<Categoria[]>(`${this.api}/listCategorias`);

  }

  
  // =========================================================
  // LISTAR CATEGORÍAS
  // =========================================================

  listarCategorias(): Observable<Categoria[]> {

    return this.http.get<Categoria[]>(
      `${this.api}/listarCategorias`
    );

  }


  // =========================================================
  // CREAR CATEGORÍA
  // =========================================================

  crearCategoria(dto: CategoriaCreate): Observable<Categoria> {

    return this.http.post<Categoria>(
      `${this.api}/crearCategoria`,
      dto
    );

  }


  // =========================================================
  // ELIMINAR CATEGORÍA
  // =========================================================

  eliminarCategoria(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/eliminarCategoria/${id}`
    );

  }

}