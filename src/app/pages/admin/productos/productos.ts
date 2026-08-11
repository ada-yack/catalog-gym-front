import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto';
import { Producto } from '../../../models/producto';
import { Modal } from '../../../shared/modal/modal'; 

@Component({
  selector: 'app-productos',
  imports: [CommonModule,Modal],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  private productoService = inject(ProductoService);

  // ==========================================
  // PRODUCTOS
  // ==========================================

  productos = signal<Producto[]>([]);
  productosPorCategoria = signal<{ [key: string]: Producto[] }>({});

  // ==========================================
  // ESTADO
  // ==========================================

  cargando = signal(true);
  error = signal(false);

  // ==========================================
  // MODAL
  // ==========================================

  modalAbierto = signal(false);

  productoSeleccionado = signal<Producto | null>(null);


  // ==========================================
  // INICIALIZAR
  // ==========================================

  ngOnInit(): void {
    this.cargarProductos();
  }


  // ==========================================
  // CARGAR PRODUCTOS
  // ==========================================

  cargarProductos(): void {

    this.cargando.set(true);
    this.error.set(false);

    this.productoService.getProductosAdmin().subscribe({

      next: (productos) => {

        console.log('Productos admin recibidos:', productos);

        this.productos.set(productos);
        this.agruparPorCategoria(productos);

        this.cargando.set(false);
      },

      error: (err) => {

        console.error('Error cargando productos:', err);

        this.error.set(true);
        this.cargando.set(false);
      }

    });
  }


  // ==========================================
  // CREAR PRODUCTO
  // ==========================================

  abrirCrear(): void {

    this.productoSeleccionado.set(null);

    this.modalAbierto.set(true);
  }


  // ==========================================
  // EDITAR PRODUCTO
  // ==========================================

  abrirEditar(producto: Producto): void {

    this.productoSeleccionado.set(producto);

    this.modalAbierto.set(true);
  }


  // ==========================================
  // CERRAR MODAL
  // ==========================================

  cerrarModal(): void {

    this.modalAbierto.set(false);

    this.productoSeleccionado.set(null);
  }


  // ==========================================
  // DESACTIVAR PRODUCTO
  // ==========================================

  desactivarProducto(producto: Producto): void {

    if (!confirm(`¿Desactivar "${producto.titulo}"?`)) {
      return;
    }

    this.productoService.desactivarProducto(producto.id).subscribe({

      next: () => {

        console.log('Producto desactivado');

        this.cargarProductos();
      },

      error: (err) => {

        console.error('Error desactivando producto:', err);
      }

    });
  }


  // ==========================================
  // ACTIVAR PRODUCTO
  // ==========================================

 activarProducto(producto: Producto): void {

  if (!confirm(`¿Activar "${producto.titulo}"?`)) {
    return;
  }

  this.productoService.activarProducto(producto.id).subscribe({

    next: () => {
      console.log('Producto activado');
      this.cargarProductos();
    },

    error: (err) => {
      console.error('Error activando producto:', err);
      alert('No se pudo activar el producto.');
    }

  });
}
agruparPorCategoria(productos: Producto[]): void {
  const agrupados: Record<string, Producto[]> = {};

  productos.forEach(producto => {
    const categoria = producto.categoria?.trim() || 'Sin categoría';

    if (!agrupados[categoria]) {
      agrupados[categoria] = [];
    }

    agrupados[categoria].push(producto);
  });

  this.productosPorCategoria.set(agrupados);
}

productoGuardado(): void {
  this.cerrarModal();
  this.cargarProductos();
}
}