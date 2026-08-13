import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  private authService = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  email = '';
  password = '';
  confirmarPassword = '';

  cargando = false;
  error = '';
  exito = '';


  registrar(): void {

    this.error = '';
    this.exito = '';

    // Validaciones
    if (
      !this.nombre.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.confirmarPassword.trim()
    ) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.cargando = true;

    this.authService.registrar({
      nombre: this.nombre.trim(),
      email: this.email.trim(),
      password: this.password
    })
    .subscribe({

      next: (respuesta) => {

        console.log('Registro correcto:', respuesta);

        this.cargando = false;

        this.exito = 'Cuenta creada correctamente.';

        // Después del registro → login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);

      },

      error: (err) => {

        console.error('Error registrando usuario:', err);

        this.cargando = false;

        if (err.status === 400) {
          this.error = 'Los datos ingresados no son válidos o el correo ya existe.';
        } else {
          this.error = 'No se pudo crear la cuenta.';
        }

      }

    });
  }


  volverLogin(): void {

    this.router.navigate(['/login']);

  }

}