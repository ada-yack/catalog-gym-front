export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  rol: 'CLIENTE' | 'ADMIN';
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}