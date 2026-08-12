import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private http = inject(HttpClient);

  private api = 'http://localhost:8080/api/categorias';

  listarCategorias(): Observable<Categoria[]> {

    return this.http.get<Categoria[]>(
      `${this.api}/listCategorias`
    );

  }

}