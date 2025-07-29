// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {} 

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Pega o token do localStorage
    const token = localStorage.getItem('auth-token');

    // Se o token existir, clona a requisição e adiciona o cabeçalho de autorização
    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      req = clonedReq;
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Se o erro for 401 (Não Autorizado), faz o logout automático.
        // Isso acontece se o token expirou ou se tornou inválido no backend.
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}