import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private readonly STORAGE_KEY = 'gm_carrito';

  private items = signal<Producto[]>(this.cargarDesdeStorage());

  readonly carrito = this.items.asReadonly();

  readonly cantidad = computed(() => this.items().length);

  readonly estaVacio = computed(() => this.items().length === 0);

  readonly total = computed(() =>
    this.items().reduce(
      (total, producto) => total + Number(producto.precioUnidad || 0),
      0
    )
  );

  constructor() {
    this.actualizarStorage(this.items());
  }

  agregar(producto: Producto): boolean {

    const existe = this.items().some(
      item => item.id === producto.id
    );

    if (existe) {
      return false;
    }

    const nuevosItems = [
      ...this.items(),
      producto
    ];

    this.items.set(nuevosItems);
    this.actualizarStorage(nuevosItems);

    return true;
  }

  eliminar(id: number): void {

    const nuevosItems = this.items().filter(
      producto => producto.id !== id
    );

    this.items.set(nuevosItems);
    this.actualizarStorage(nuevosItems);
  }

  vaciar(): void {

    this.items.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  estaEnCarrito(id: number): boolean {

    return this.items().some(
      producto => producto.id === id
    );
  }

  private cargarDesdeStorage(): Producto[] {

    try {

      const datos = localStorage.getItem(this.STORAGE_KEY);

      if (!datos) {
        return [];
      }

      return JSON.parse(datos) as Producto[];

    } catch (error) {

      console.error(
        'Error leyendo carrito:',
        error
      );

      return [];
    }
  }

  private actualizarStorage(items: Producto[]): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(items)
    );
  }
}