import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../core/services/producto';
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  private productoService = inject(ProductoService);

  // =========================================================
  // DATOS
  // =========================================================

  productos = signal<Producto[]>([]);

  productosPorCategoria = signal<{ [key: string]: Producto[] }>({});

  cargando = signal(true);

  error = signal(false);


  // =========================================================
  // INICIO
  // =========================================================

  ngOnInit(): void {

    console.log('Productos iniciado');

    this.cargarProductos();
  }


  // =========================================================
  // CARGAR PRODUCTOS
  // =========================================================

  cargarProductos(): void {

    // Mostrar estado de carga
    this.cargando.set(true);

    // Quitar mensaje de error
    this.error.set(false);


    this.productoService.getProductos().subscribe({

      next: (data: Producto[]) => {

        console.log('Productos recibidos:', data);

        // Guardar productos
        this.productos.set(data);

        // Agrupar productos
        this.agruparPorCategoria(data);

        // Terminar carga
        this.cargando.set(false);
      },


      error: (err) => {

        console.error('Error cargando productos:', err);

        this.error.set(true);

        this.cargando.set(false);
      }

    });
  }


  // =========================================================
  // AGRUPAR POR CATEGORIA
  // =========================================================

  agruparPorCategoria(productos: Producto[]): void {

    const agrupados: { [key: string]: Producto[] } = {};


    productos.forEach(producto => {

      const categoria = producto.categoria;

      if (!agrupados[categoria]) {
        agrupados[categoria] = [];
      }

      agrupados[categoria].push(producto);

    });


    this.productosPorCategoria.set(agrupados);

    console.log('Productos agrupados:', agrupados);
  }


  // =========================================================
  // WHATSAPP
  // =========================================================

  crearLinkWhatsApp(titulo: string): string {

    const mensaje = `Hola! Me interesa: ${titulo}`;

    return `https://wa.me/949626583?text=${encodeURIComponent(mensaje)}`;
  }

}