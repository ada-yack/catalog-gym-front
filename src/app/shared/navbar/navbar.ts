import { Component,computed, DestroyRef, inject, OnInit, signal,} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductoService } from '../../core/services/producto';
import { Producto } from '../../models/producto';

import { CommonModule } from '@angular/common';
import { CarritoService } from '../../core/services/carrito';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class Navbar implements OnInit {
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private destroyRef = inject(DestroyRef);
  carritoService = inject(CarritoService);

  

  menuOpen = signal(false);
  scrolled = signal(false);

  buscadorAbierto = signal(false);
  terminoBusqueda = signal('');
  productos = signal<Producto[]>([]);


  irAlCarrito(): void {
  console.log('CLICK CARRITO');
  this.router.navigate(['/carrito']);
}

  resultados = computed(() => {
    const termino = this.normalizarTexto(this.terminoBusqueda());

    if (!termino) {
      return [];
    }

    return this.productos()
      .filter(producto => {
        const contenido = this.normalizarTexto(`
          ${producto.titulo}
          ${producto.categoria}
          ${producto.descripcion}
          ${producto.adicional ?? ''}
        `);

        return contenido.includes(termino);
      })
      .slice(0, 5);
  });

  ngOnInit(): void {
    this.productoService.getProductos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: productos => this.productos.set(productos),
        error: error => console.error('Error cargando buscador:', error),
      });
  }

  toggleMenu(): void {
    this.menuOpen.update(abierto => !abierto);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleBuscador(): void {
    this.buscadorAbierto.update(abierto => !abierto);
  }

  cerrarBuscador(): void {
    this.buscadorAbierto.set(false);
    this.terminoBusqueda.set('');
  }

  

  actualizarBusqueda(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  buscar(): void {
    const termino = this.terminoBusqueda().trim();

    if (!termino) {
      return;
    }

    this.router.navigate(['/productos'], {
      queryParams: { buscar: termino },
    });

    this.cerrarBuscador();
  }

  seleccionarProducto(producto: Producto): void {
    this.router.navigate(['/productos'], {
      queryParams: { buscar: producto.titulo },
    });

    this.cerrarBuscador();
  }

  normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }
}