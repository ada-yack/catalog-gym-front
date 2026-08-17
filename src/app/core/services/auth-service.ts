import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, from, switchMap } from 'rxjs';

import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';

import { auth } from '../firebase/firebase.config';

import { LoginUsuario } from '../../models/auth/login-usuario';
import { RegistroUsuario } from '../../models/auth/registro-usuario';
import { LoginResponse } from '../../models/auth/login-response';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = '/api/auth';

  // ==========================================
  // LOGIN
  // ==========================================

  login(datos: LoginUsuario): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        datos
      )
      .pipe(

        tap(respuesta => {

          localStorage.setItem(
            'token',
            respuesta.token
          );

          localStorage.setItem(
            'usuario',
            JSON.stringify(respuesta.usuario)
          );

        })

      );
  }


  // ==========================================
  // REGISTRO
  // ==========================================

  registrar(datos: RegistroUsuario): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/registro`,
      datos
    );

  }


  // ==========================================
  // TOKEN
  // ==========================================

  obtenerToken(): string | null {

    return localStorage.getItem('token');

  }


  // ==========================================
  // USUARIO
  // ==========================================

  obtenerUsuario(): any {

    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
      return null;
    }

    return JSON.parse(usuario);

  }


  // ==========================================
  // AUTENTICADO
  // ==========================================

  estaAutenticado(): boolean {

    return !!this.obtenerToken();

  }


  // ==========================================
  // ROL
  // ==========================================

  esAdmin(): boolean {

    const usuario = this.obtenerUsuario();

    return usuario?.rol === 'ADMIN';

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

  }


  
loginConGoogle(): void {

  const provider = new GoogleAuthProvider();

  console.log('1. Antes de abrir Google');

  signInWithPopup(auth, provider)
    .then(async resultado => {

      console.log('2. Google terminó correctamente');

      const usuario = resultado.user;

      console.log('3. Usuario:', usuario.email);

      const tokenFirebase = await usuario.getIdToken();

      console.log('4. Token Firebase obtenido');

      this.http.post<LoginResponse>(
        `${this.apiUrl}/google`,
        {
          token: tokenFirebase
        }
      )
      .subscribe({

        next: respuesta => {

          console.log('5. Spring respondió ✅');
          console.log(respuesta);

          localStorage.setItem(
            'token',
            respuesta.token
          );

          localStorage.setItem(
            'usuario',
            JSON.stringify(respuesta.usuario)
          );

        },

        error: error => {

          console.error(
            '6. Error de Spring:',
            error
          );

        }

      });

    })
    .catch(error => {

      console.error(
        'ERROR EN GOOGLE:',
        error
      );

    });
}
}