import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from  '../../../core/services/carrito';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito {

  private carritoService = inject(CarritoService);

  carrito = this.carritoService.carrito;
  cantidad = this.carritoService.cantidad;
  total = this.carritoService.total;
  estaVacio = this.carritoService.estaVacio;

  eliminar(id: number): void {
    this.carritoService.eliminar(id);
  }

  vaciar(): void {
    this.carritoService.vaciar();
  }

  pedirPorWhatsApp(): void {

  const productos = this.carrito();

  if (productos.length === 0) {
    return;
  }

  const baseUrl = 'https://gyselmood.netlify.app';

  const lista = productos
    .map(producto => {

      const urlProducto =
        `${baseUrl}/productos?producto=${producto.id}`;

      return [
        `• ${producto.titulo}`,
        urlProducto
      ].join('\n');

    })
    .join('\n\n');

  const mensaje = [
    'Hola! Mucho gusto 😊',
    '',
    'Me interesan estos productos de G&M:',
    '',
    lista,
    '',
    'Quedo atento(a). ¡Muchas gracias!'
  ].join('\n');

  const url =
    `https://wa.me/949626583?text=${encodeURIComponent(mensaje)}`;

  window.open(url, '_blank');
}
}