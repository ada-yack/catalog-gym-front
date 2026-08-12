import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  // Si no hay token, dejamos pasar la petición normal
  if (!token) {
    return next(req);
  }

  // Si hay token, lo agregamos al Authorization
  const requestConToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(requestConToken);
};