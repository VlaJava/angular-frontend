import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, switchMap, throwError, of, lastValueFrom, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { User } from '../types/user.type';
import { LoginResponse } from '../types/login-response.type';
import { UserSignup } from '../types/user-signup.type';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../types/login-request.type';

interface DecodedToken {
  sub: string;      // 'sub' (subject) é o ID do utilizador
  scope: string;    // 'scope' é onde a sua API coloca a role (ex: "ADMIN")
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;

  private http?: HttpClient;

  constructor(private injector: Injector) {
    // REMOVEMOS a chamada à lógica de carregamento daqui.
    this.isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
    this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'ADMIN'));
  }
  
  /**
   * Este método será chamado pelo APP_INITIALIZER antes da aplicação arrancar.
   * Ele verifica o token, carrega os dados do utilizador e retorna uma Promise.
   */
  public initUser(): Promise<any> {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.sub;
        const userRole = decodedToken.scope as 'ADMIN' | 'CLIENT';

        // Usamos lastValueFrom para converter o Observable em Promise, que o APP_INITIALIZER espera
        return lastValueFrom(
          this.fetchUserProfile(userId).pipe(
            map(userProfile => ({ ...userProfile, role: userRole })),
            tap(user => {
              this.currentUserSubject.next(user);
              localStorage.setItem('currentUser', JSON.stringify(user));
            }),
            catchError(() => {
              this.logout();
              return of(null); // Em caso de erro, resolve a promise para não bloquear a app
            })
          )
        );
      } catch (error) {
        this.logout();
        return Promise.resolve(); // Token inválido, resolve a promise
      }
    } else {
      // Não há token, apenas garante que o estado está limpo e resolve a promise
      this.logout();
      return Promise.resolve(); 
    }
  }

  private getHttp(): HttpClient {
    if (!this.http) {
      this.http = this.injector.get(HttpClient);
    }
    return this.http;
  }

  login(credenciais: LoginRequest): Observable<User> {
    return this.getHttp().post<LoginResponse>(`${this.apiUrl}/auth`, credenciais).pipe(
      tap(response => localStorage.setItem('auth-token', response.accessToken)),
      switchMap(response => {
        try {
          const decodedToken = jwtDecode<DecodedToken>(response.accessToken);
          const userId = decodedToken.sub;
          const userRole = decodedToken.scope as 'ADMIN' | 'CLIENT';

          return this.fetchUserProfile(userId).pipe(
            map(userProfile => ({ ...userProfile, role: userRole }))
          );
        } catch (error) {
          return throwError(() => new Error("Token inválido recebido do backend."));
        }
      }),
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth-token');
    this.currentUserSubject.next(null);
  }
  
  private fetchUserProfile(id: string): Observable<User> {
    return this.getHttp().get<User>(`${this.apiUrl}/users/${id}`);
  }

  signup(data: UserSignup): Observable<any> {
    return this.getHttp().post<any>(`${this.apiUrl}/users`, data);
  }

  forgotPassword(email: string): Observable<void> {
    return this.getHttp().post<void>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<void> {
    const resetPasswordRequest = {
      novaSenha: newPassword,
      confirmarSenha: confirmPassword
    };
    return this.getHttp().post<void>(`${this.apiUrl}/auth/reset-password?token=${token}`, resetPasswordRequest);
  }
}
