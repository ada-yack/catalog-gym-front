import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

  private apiUrl = 'http://localhost:8080/api/auth';

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

  signInWithPopup(auth, provider)
    .then(async (resultado) => {

      const usuario = resultado.user;

      const tokenFirebase = await usuario.getIdToken();

      console.log('========================');
      console.log('GOOGLE FUNCIONA ✅');
      console.log('Email:', usuario.email);
      console.log('Nombre:', usuario.displayName);
      console.log('Token Firebase:', tokenFirebase);
      console.log('========================');

    })
    .catch((error) => {

      console.error('Error con Google:', error);

    });
}
}