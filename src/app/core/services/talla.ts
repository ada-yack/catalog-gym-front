import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Talla } from "../../models/Talla";
import { TallaCreate } from '../../models/talla-create';

@Injectable({
  providedIn: 'root'
})
export class TallaService {

  private http = inject(HttpClient);

  private api = 'http://localhost:8080/api/tallas';

  listTallas(): Observable<Talla[]> {

    return this.http.get<Talla[]>(
      `${this.api}/listTallas`
    );

  }

  // 2. Guardar
  guardarTalla(dto: TallaCreate): Observable<Talla> {
    return this.http.post<Talla>(`${this.api}/guardarTalla`, dto);
  }

  // 3. Eliminar
  eliminarTalla(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/eliminarTalla/${id}`);
  }

}