import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallaService } from '../../../core/services/talla';
import { Talla } from '../../../models/Talla';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-tallas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tallas.html',
  styleUrl: './tallas.css',
})
export class Tallas implements OnInit {
  private tallaService = inject(TallaService);
  private cdr = inject(ChangeDetectorRef);

  tallas: Talla[] = [];
  nuevaTallaNombre: string = '';
  cargando: boolean = false;
  mensajeError: string = '';

  ngOnInit(): void {
    this.cargarTallas();
  }

 cargarTallas(): void {
  this.cargando = true;
  this.mensajeError = '';

  this.tallaService.listTallas().subscribe({
    next: (data) => {
      console.log('TALLAS RECIBIDAS:', data);

      this.tallas = data;
      this.cargando = false;

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error('Error al cargar tallas:', err);

      this.mensajeError = 'No se pudieron cargar las tallas.';
      this.cargando = false;

      this.cdr.detectChanges();
    }
  });
}


  crear(): void {
    if (!this.nuevaTallaNombre.trim()) return;

    const dto = { nombre: this.nuevaTallaNombre.trim().toUpperCase() };

    this.tallaService.guardarTalla(dto).subscribe({
      next: () => {
        this.nuevaTallaNombre = '';
        this.cargarTallas();
      },
      error: (err) => {
        console.error('Error al crear talla:', err);
        alert('Error al guardar la talla. Asegúrate de estar autenticado como ADMIN.');
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta talla?')) {
      this.tallaService.eliminarTalla(id).subscribe({
        next: () => this.cargarTallas(),
        error: (err) => {
          console.error('Error al eliminar talla:', err);
          alert('No se pudo eliminar la talla.');
        }
      });
    }
  }
}