import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  private url = "http://localhost:8090/api/productos";


  constructor(
    private http: HttpClient
  ){}


  getProductos():Observable<Producto[]>{

    return this.http.get<Producto[]>(this.url);

  }

}