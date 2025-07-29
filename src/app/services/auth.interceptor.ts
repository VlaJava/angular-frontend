import { Injectable, Injector } from '@angular/core'; // Alteração 1: Importar Injector
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

  // Alteração 2: Injetar o Injector em vez do AuthService diretamente.
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Alteração 3: Obter o AuthService e o token DENTRO do método intercept.
    // Isto quebra o ciclo de dependência na inicialização.
    const authService = this.injector.get(AuthService);
    const token = localStorage.getItem('auth-token');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Usar a instância do authService obtida anteriormente.
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
