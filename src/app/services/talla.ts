import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Talla } from "../models/Talla";

@Injectable({
  providedIn: 'root'
})
export class TallaService {

  private http = inject(HttpClient);

  private api = 'http://localhost:8080/api/tallas';

  listarTallas(): Observable<Talla[]> {

    return this.http.get<Talla[]>(
      `${this.api}/listTallas`
    );

  }

}