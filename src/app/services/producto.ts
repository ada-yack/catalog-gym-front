import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';
import { ProductoCreate } from '../models/producto-create';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private api = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  // =========================
  // PÚBLICO
  // =========================

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${this.api}/listarProductoData`
    );
  }



  // =========================
  // ADMIN
  // =========================

  // Listar todos los productos
  // incluyendo los inactivos
  getProductosAdmin(): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${this.api}/listarProductoData`
    );
  }


  // Crear producto
crearProducto(producto: ProductoCreate): Observable<Producto> {
  return this.http.post<Producto>(
    `${this.api}/crear`,
    producto
  );
}


  // Editar parcialmente un producto
  actualizarProducto(
    id: number,
    cambios: any
  ): Observable<any> {

    return this.http.patch(
      `${this.api}/${id}`,
      cambios
    );
  }


  // Desactivar producto
  desactivarProducto(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/${id}`
    );
  }

  activarProducto(id: number): Observable<Producto> {

  return this.http.patch<Producto>(
    `${this.api}/${id}/activar`,
    {}
  );

}

}