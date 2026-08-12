import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  // ==========================================
  // FORMULARIO
  // ==========================================

  email = '';
  password = '';

  cargando = false;
  error = '';


  // ==========================================
  // LOGIN
  // ==========================================

  iniciarSesion(): void {

    this.error = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Completa todos los campos.';
      return;
    }

    this.cargando = true;

    this.authService.login({
      email: this.email,
      password: this.password
    })
    .subscribe({

      next: (respuesta) => {

        console.log('Login correcto:', respuesta);

        this.cargando = false;

        // Por ahora vamos al inicio
        this.router.navigate(['/']);

      },

      error: (err) => {

        console.error('Error iniciando sesión:', err);

        this.cargando = false;

        if (err.status === 401) {
          this.error = 'Correo o contraseña incorrectos.';
        } else {
          this.error = 'No se pudo iniciar sesión.';
        }

      }

    });
  }
}