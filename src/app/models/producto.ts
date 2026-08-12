

export interface Producto {
  id: number;
  titulo: string;
  descripcion: string;
  adicional?: string;
  precioUnidad: number;
  precioTotal?: number;
  categoriaId: number;
  categoria: string;
  activo: boolean;
  tallas?: Talla[];
  imagenes?: Imagen[];
}

export interface Talla {

  id: number;
  nombre: string;
  stock: number;

}


export interface Imagen {
  id: number;
  url: string;
  publicId: string;
  esPrincipal: boolean;
}