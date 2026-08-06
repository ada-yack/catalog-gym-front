

export interface Producto {

 id:number;
 titulo:string;
 descripcion:string;
 adicional:string;
 precioUnidad:number;
 precioTotal:number;
 categoria:string;

 tallas:any[];
 imagenes:any[];

}
/*
export interface Talla {

  id: number;
  nombre: string;
  stock: number;

}


export interface ImagenProducto {

  id: number;
  url: string;
  esPrincipal: boolean;

}*/
