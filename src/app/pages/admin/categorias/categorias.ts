import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoriaService } from '../../../core/services/categoria';
import { Categoria } from '../../../models/categoria';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {

  private categoriaService = inject(CategoriaService);
  private cdr = inject(ChangeDetectorRef);

  categorias: Categoria[] = [];

  nuevoCodigo: string = '';
  nuevoNombre: string = '';

  cargando: boolean = false;
  mensajeError: string = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.categoriaService.listarCategorias().subscribe({

      next: (data) => {

        console.log('CATEGORÍAS RECIBIDAS:', data);

        this.categorias = data;
        this.cargando = false;

        // Por el problema que tuvimos con el refresh
        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error('Error al cargar categorías:', err);

        this.mensajeError = 'No se pudieron cargar las categorías.';
        this.cargando = false;

        this.cdr.detectChanges();
      }

    });
  }


  crear(): void {

    if (
      !this.nuevoCodigo.trim() ||
      !this.nuevoNombre.trim()
    ) {
      return;
    }

    const dto = {
      codigo: this.nuevoCodigo.trim().toUpperCase(),
      nombre: this.nuevoNombre.trim()
    };

    this.categoriaService.crearCategoria(dto).subscribe({

      next: () => {

        this.nuevoCodigo = '';
        this.nuevoNombre = '';

        this.cargarCategorias();
      },

      error: (err) => {

        console.error('Error al crear categoría:', err);

        alert('No se pudo guardar la categoría.');
      }

    });
  }


  eliminar(id: number): void {

    if (!confirm('¿Estás seguro de eliminar esta categoría?')) {
      return;
    }

    this.categoriaService.eliminarCategoria(id).subscribe({

      next: () => {
        this.cargarCategorias();
      },

      error: (err) => {

        console.error('Error al eliminar categoría:', err);

        alert('No se pudo eliminar la categoría.');
      }

    });
  }

}