import { Component, OnInit } from '@angular/core';
import { ProductoService } from "../../../services/producto";
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  productos: Producto[] = [];

  constructor(
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {

    console.log('Productos cargado');

    this.productoService.getProductos().subscribe({

      next: (data: Producto[]) => {

        console.log(data);

        this.productos = data;

      },

      error: (err: any) => {

        console.error('Error:', err);

      }

    });

  }

}