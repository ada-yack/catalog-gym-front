import { Component, EventEmitter,Input, Output, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoriaService } from '../../core/services/categoria';
import { Categoria } from '../../models/categoria';

import { ProductoCreate } from '../../models/producto-create';
import { ProductoService } from '../../core/services/producto';

import { TallaService } from '../../core/services/talla';
import { Talla } from '../../models/Talla';

import { ImagenCreate } from '../../models/imagen-create';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-modal',
  imports: [FormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements OnInit {

  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);
  private tallaService = inject(TallaService);

  // Cloudinary
  private cloudName = 'imgapi';
  private uploadPreset = 'gym_preset';
  private cloudinaryFolder = 'gym_products';

  @Output() cerrar = new EventEmitter<void>();

  // Formulario
  titulo = '';
  descripcion = '';
  adicional = '';
  precioUnidad: number | null = null;
  precioTotal: number | null = null;
  categoriaId: number | null = null;

  // Datos
  categorias: Categoria[] = [];
  tallas: Talla[] = [];

  tallasSeleccionadas: { tallaId: number; stock: number }[] = [];

imagenesSeleccionadas: {
  id?: number;
  archivo?: File;
  preview: string;
  url?: string;
  publicId?: string;
  esPrincipal: boolean;
}[] = [];


@Input()
producto: Producto | null = null;

@Output()
guardado = new EventEmitter<void>();

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarTallas();

    if (this.producto) {
    this.cargarDatosProducto(this.producto);
  }
  }


private cargarDatosProducto(producto: Producto): void {

  this.titulo = producto.titulo;
  this.descripcion = producto.descripcion ?? '';
  this.adicional = producto.adicional ?? '';

  this.precioUnidad = producto.precioUnidad;
  this.precioTotal = producto.precioTotal ?? null;

  this.categoriaId = producto.categoriaId;

  this.imagenesSeleccionadas = (producto.imagenes ?? []).map(imagen => ({
    id: imagen.id,
    preview: imagen.url,
    url: imagen.url,
    publicId: imagen.publicId,
    esPrincipal: imagen.esPrincipal
  }));

  // 👇 AGREGAR ESTO
  this.tallasSeleccionadas = (producto.tallas ?? []).map(talla => ({
    tallaId: talla.id,
    stock: talla.stock
  }));
}
  // ===================== CATEGORÍAS =====================

  cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (categorias) => {
        console.log('Categorías recibidas:', categorias);
        this.categorias = categorias;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  // ===================== TALLAS =====================

  cargarTallas(): void {
    this.tallaService.listTallas().subscribe({
      next: (tallas) => {
        console.log('Tallas recibidas:', tallas);
        this.tallas = tallas;
      },
      error: (err) => {
        console.error('Error cargando tallas:', err);
      }
    });
  }

  seleccionarTalla(tallaId: number): void {
  const existe = this.tallasSeleccionadas.some(t => t.tallaId === tallaId);

  if (existe) {
    // Deseleccionar
    this.tallasSeleccionadas = this.tallasSeleccionadas.filter(
      t => t.tallaId !== tallaId
    );
  } else {
    // Seleccionar con stock 0
    this.tallasSeleccionadas.push({
      tallaId,
      stock: 0
    });
  }
}
  cambiarStock(tallaId: number, stock: number): void {
    const talla = this.tallasSeleccionadas.find(t => t.tallaId === tallaId);
    if (talla) {
      talla.stock = stock;
    }
  }


  seleccionarTodasLasTallas(): void {

  if (this.todasLasTallasSeleccionadas()) {

    // Deseleccionar todas
    this.tallasSeleccionadas = [];

  } else {

    // Seleccionar todas
    this.tallasSeleccionadas = this.tallas.map(talla => ({
      tallaId: talla.id,
      stock: 0
    }));

  }
}

todasLasTallasSeleccionadas(): boolean {

  return (
    this.tallas.length > 0 &&
    this.tallasSeleccionadas.length === this.tallas.length
  );

}
  // ===================== IMÁGENES =====================

seleccionarImagen(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files) return;

  const archivos = Array.from(input.files);

  if (this.imagenesSeleccionadas.length + archivos.length > 3) {
    alert('Máximo 3 imágenes por producto.');
    input.value = '';
    return;
  }

  for (const archivo of archivos) {

    const preview = URL.createObjectURL(archivo);

    this.imagenesSeleccionadas.push({
      archivo,
      preview,
      esPrincipal: this.imagenesSeleccionadas.length === 0
    });
  }

  input.value = '';
}

 eliminarImagen(index: number): void {

  const imagen = this.imagenesSeleccionadas[index];

  if (!imagen) return;

  // Solo liberar memoria si es una preview creada
  // mediante URL.createObjectURL()
  if (imagen.archivo) {
    URL.revokeObjectURL(imagen.preview);
  }

  this.imagenesSeleccionadas.splice(index, 1);

  // Si eliminamos la principal,
  // hacemos principal la primera restante
  if (
    this.imagenesSeleccionadas.length > 0 &&
    !this.imagenesSeleccionadas.some(img => img.esPrincipal)
  ) {
    this.imagenesSeleccionadas[0].esPrincipal = true;
  }
}

  hacerPrincipal(index: number): void {
    this.imagenesSeleccionadas.forEach((imagen, i) => {
      imagen.esPrincipal = i === index;
    });
  }

  // ===================== GUARDAR PRODUCTO =====================

  async guardarProducto(): Promise<void> {
    // Validaciones
    if (!this.titulo.trim()) {
      alert('El título es obligatorio.');
      return;
    }

    if (!this.precioUnidad || this.precioUnidad <= 0) {
      alert('Ingresa un precio unitario válido.');
      return;
    }

    if (!this.categoriaId) {
      alert('Selecciona una categoría.');
      return;
    }

    // ==========================================
// PROCESAR IMÁGENES
// ==========================================

const imagenes: any[] = [];

for (const imagen of this.imagenesSeleccionadas) {

  // Imagen existente
  if (imagen.id) {

    imagenes.push({
      id: imagen.id,
      url: imagen.url,
      publicId: imagen.publicId,
      esPrincipal: imagen.esPrincipal
    });

  }

  // Imagen nueva
  else if (imagen.archivo) {

    const resultado = await this.subirCloudinary(imagen.archivo);

    imagenes.push({
      url: resultado.url,
      publicId: resultado.publicId,
      esPrincipal: imagen.esPrincipal
    });
  }
}
    // DTO
    const producto: ProductoCreate = {
      titulo: this.titulo.trim(),
      descripcion: this.descripcion.trim() || undefined,
      adicional: this.adicional.trim() || undefined,
      precioUnidad: this.precioUnidad,
      precioTotal: this.precioTotal || undefined,
      categoriaId: this.categoriaId,
      tallas: this.tallasSeleccionadas,
      imagenes
    };

    console.log('Producto que se enviará:', producto);

// ==========================================
// EDITAR
// ==========================================

if (this.producto) {

const cambios = {
  titulo: producto.titulo,
  descripcion: producto.descripcion,
  adicional: producto.adicional,
  precioUnidad: producto.precioUnidad,
  precioTotal: producto.precioTotal,
  categoriaId: producto.categoriaId,
  tallas: producto.tallas,
  imagenes: imagenes
};

  this.productoService
    .actualizarProducto(this.producto.id, cambios)
    .subscribe({

      next: () => {

        console.log('Producto actualizado');

        alert('Producto actualizado correctamente.');

        this.guardado.emit();

        this.cerrarModal();
      },

      error: (err) => {

        console.error('Error actualizando producto:', err);

        alert('No se pudo actualizar el producto.');
      }

    });

  return;
}


// ==========================================
// CREAR
// ==========================================

this.productoService.crearProducto(producto).subscribe({

  next: (respuesta) => {

    console.log('Producto creado:', respuesta);

    alert('Producto creado correctamente.');

    this.guardado.emit();

    this.limpiarPreviews();

    this.cerrarModal();
  },

  error: (err) => {

    console.error('Error creando producto:', err);

    alert('No se pudo crear el producto.');
  }

});

}

  // ===================== CLOUDINARY =====================

  private async subirCloudinary(archivo: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', this.cloudinaryFolder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Error al subir imagen a Cloudinary');
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  }

  // ===================== UTILIDADES =====================

  private limpiarPreviews(): void {
    this.imagenesSeleccionadas.forEach(imagen => {
      URL.revokeObjectURL(imagen.preview);
    });
    this.imagenesSeleccionadas = [];
  }



  cerrarModal(): void {
    this.limpiarPreviews();
    this.cerrar.emit();
  }
}