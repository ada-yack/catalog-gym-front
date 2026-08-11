import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  menuAbierto = signal(false);

  toggleMenu(): void {
    this.menuAbierto.update(abierto => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}