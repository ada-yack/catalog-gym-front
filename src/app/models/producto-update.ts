import { ProductoTallaCreate } from './Producto-Talla-Create';
import { ImagenCreate } from './imagen-create';

export interface ProductoUpdate {
  id: number;
  titulo?: string;
  descripcion?: string;
  adicional?: string;
  precioUnidad?: number;
  precioTotal?: number;
  categoriaId?: number;
  tallas?: ProductoTallaCreate[];
  imagenes?: ImagenCreate[];
}