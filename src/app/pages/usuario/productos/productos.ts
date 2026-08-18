import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductoService } from '../../../core/services/producto';
import { Producto } from '../../../models/producto';
import { ProductoDetalleModal } from "../../../shared/producto-detalle-modal/producto-detalle-modal";

import { CarritoService } from '../../../core/services/carrito';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ProductoDetalleModal],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  private productoService = inject(ProductoService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private carritoService = inject(CarritoService);

  productosPorCategoria = signal<Record<string, Producto[]>>({});

  cargando = signal(true);
  error = signal(false);

  terminoBusqueda = signal('');
  categoriaSeleccionada = signal<string | null>(null);
  private fragmentoPendiente = signal<string | null>(null);

  productoSeleccionado = signal<Producto | null>(null);
  private productoIdPendiente = signal<number | null>(null);

abrirDetalle(producto: Producto): void {
  this.productoSeleccionado.set(producto);
}

cerrarDetalle(): void {
  this.productoSeleccionado.set(null);
}

agregarAlCarrito(producto: Producto): void {

  const agregado = this.carritoService.agregar(producto);

  if (agregado) {
    console.log(
      'Producto agregado al carrito:',
      producto
    );
  } else {
    console.log(
      'El producto ya está en el carrito'
    );
  }
}
  categoriasDisponibles = computed(() =>
    Object.keys(this.productosPorCategoria()),
  );

  productosPorCategoriaFiltrados = computed(() => {
    const categoriaSeleccionada = this.categoriaSeleccionada();
    const termino = this.normalizarTexto(this.terminoBusqueda());
    const gruposFiltrados: Record<string, Producto[]> = {};

    for (const [categoria, productos] of Object.entries(
      this.productosPorCategoria(),
    )) {
      if (categoriaSeleccionada && categoria !== categoriaSeleccionada) {
        continue;
      }

      const productosFiltrados = productos.filter(producto => {
        const contenido = this.normalizarTexto(`
          ${producto.titulo}
          ${producto.categoria}
          ${producto.descripcion}
          ${producto.adicional ?? ''}
        `);

        return !termino || contenido.includes(termino);
      });

      if (productosFiltrados.length > 0) {
        gruposFiltrados[categoria] = productosFiltrados;
      }
    }

    return gruposFiltrados;
  });

  hayProductosFiltrados = computed(() =>
    Object.keys(this.productosPorCategoriaFiltrados()).length > 0,
  );

ngOnInit(): void {

  this.cargarProductos();

  this.route.fragment
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(fragmento => {
      this.fragmentoPendiente.set(fragmento);
      this.irACategoriaPendiente();
    });

  this.route.queryParamMap
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {

      this.terminoBusqueda.set(
        params.get('buscar') ?? ''
      );

      const productoId = params.get('producto');

      this.productoIdPendiente.set(
        productoId ? Number(productoId) : null
      );

      this.abrirProductoPendiente();
    });
}

  cargarProductos(): void {
    this.cargando.set(true);
    this.error.set(false);

    this.productoService.getProductos().subscribe({
      next: productos => {

  this.agruparPorCategoria(productos);

  this.cargando.set(false);

  setTimeout(() => {

    this.irACategoriaPendiente();

    this.abrirProductoPendiente();

  });

},

      error: error => {
        console.error('Error cargando productos:', error);
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  agruparPorCategoria(productos: Producto[]): void {
    const agrupados: Record<string, Producto[]> = {};

    for (const producto of productos) {
      const categoria = producto.categoria;

      if (!agrupados[categoria]) {
        agrupados[categoria] = [];
      }

      agrupados[categoria].push(producto);
    }

    this.productosPorCategoria.set(agrupados);
  }

  seleccionarCategoria(categoria: string | null): void {
    this.categoriaSeleccionada.set(categoria);

    if (!categoria) {
      return;
    }

    // Al filtrar queda una sección visible: hacemos scroll hacia ella.
    setTimeout(() => {
      document.querySelector<HTMLElement>('.cat-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  crearLinkWhatsApp(titulo: string): string {
    const mensaje = `Hola! Me interesa: ${titulo}`;

    return `https://wa.me/949626583?text=${encodeURIComponent(mensaje)}`;
  }

  crearIdCategoria(categoria: string): string {
    const nombre = this.normalizarTexto(categoria);

    if (nombre.includes('polera')) return 'categoria-poleras';
    if (nombre.includes('polo')) return 'categoria-polos';
    if (nombre.includes('pijama')) return 'categoria-pijamas';
    if (nombre.includes('conjunto')) return 'categoria-conjuntos';
    if (nombre.includes('familia')) return 'categoria-familia';
    if (nombre.includes('personaje')) return 'categoria-personaje';

    return `categoria-${nombre.replace(/\s+/g, '-')}`;
  }

  esPrimeraCategoria(categoria: string): boolean {
    const categorias = Object.keys(this.productosPorCategoria());
    const tipo = this.obtenerTipoCategoria(categoria);

    if (!tipo) {
      return true;
    }

    return categorias.find(item =>
      this.obtenerTipoCategoria(item) === tipo,
    ) === categoria;
  }

  irACategoriaPendiente(): void {
    const fragmento = this.fragmentoPendiente();

    if (!fragmento || this.cargando()) {
      return;
    }

    const seccion = document.getElementById(fragmento);

    if (!seccion) {
      return;
    }

    seccion.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.fragmentoPendiente.set(null);
  }

  private obtenerTipoCategoria(categoria: string): string | null {
    const nombre = this.normalizarTexto(categoria);

    if (nombre.includes('polera')) return 'polera';
    if (nombre.includes('polo')) return 'polo';
    if (nombre.includes('pijama')) return 'pijama';
    if (nombre.includes('conjunto')) return 'conjunto';
    if (nombre.includes('familia')) return 'familia';
    if (nombre.includes('personaje')) return 'personaje';

    return null;
  }

  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }


  private abrirProductoPendiente(): void {

  const id = this.productoIdPendiente();

  if (!id) {
    return;
  }

  const productos = Object.values(
    this.productosPorCategoria()
  ).flat();

  const producto = productos.find(
    p => p.id === id
  );

  if (!producto) {
    return;
  }

  this.productoSeleccionado.set(producto);

  this.productoIdPendiente.set(null);
}
}