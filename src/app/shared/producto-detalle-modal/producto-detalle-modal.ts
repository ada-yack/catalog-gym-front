import {
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-detalle-modal',
  imports: [DecimalPipe],
  templateUrl: './producto-detalle-modal.html',
  styleUrl: './producto-detalle-modal.css',
  host: {
    '(document:keydown.escape)': 'cerrarModal()',
  },
})
export class ProductoDetalleModal {
  producto = input.required<Producto>();

  cerrar = output<void>();
  agregarCarrito = output<Producto>();

  imagenActiva = signal(0);

  imagenActual = computed(() => {
    const imagenes = this.producto().imagenes ?? [];
    return imagenes[this.imagenActiva()] ?? null;
  });

  seleccionarImagen(indice: number): void {
    this.imagenActiva.set(indice);
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  agregar(): void {
    this.agregarCarrito.emit(this.producto());
  }

  crearLinkWhatsApp(): string {
    const producto = this.producto();

    const mensaje = [
      'Hola! Me interesa este producto:',
      producto.titulo,
      `Categoría: ${producto.categoria}`,
      `Precio: S/ ${producto.precioUnidad.toFixed(2)}`,
    ].join('\n');

    return `https://wa.me/949626583?text=${encodeURIComponent(mensaje)}`;
  }
}
