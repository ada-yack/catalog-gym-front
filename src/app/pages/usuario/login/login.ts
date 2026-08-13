import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

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
  // USUARIO
  // ==========================================

  usuario: any = null;

  ngOnInit(): void {

    if (this.authService.estaAutenticado()) {

      this.usuario = this.authService.obtenerUsuario();

      console.log('Usuario ya autenticado:', this.usuario);

    }

  }

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

        if (respuesta.usuario.rol === 'ADMIN') {

          this.router.navigate(['/admin/productos']);

        } else {

          this.router.navigate(['/']);

        }

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

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  cerrarSesion(): void {

    this.authService.logout();

    this.usuario = null;

    this.email = '';
    this.password = '';

    this.router.navigate(['/']);

  }

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  irProductos(): void {

    this.router.navigate(['/productos']);

  }

  irAdmin(): void {

    this.router.navigate(['/admin/productos']);

  }

  irRegistro(): void {
  this.router.navigate(['/registro']);
}

loginGoogle(): void {
  this.authService.loginConGoogle();
}

}