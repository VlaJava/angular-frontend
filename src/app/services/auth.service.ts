import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, switchMap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { User } from '../types/user.type';
// ✅ CORREÇÃO: A interface agora corresponde à resposta da API
import { LoginResponse } from '../types/login-response.type';
import { UserSignup } from '../types/user-signup.type';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../types/login-request.type';

// Interface para descrever o conteúdo do token descodificado
interface DecodedToken {
  sub: string; // 'sub' (subject) é o padrão para o ID do utilizador no JWT
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

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
    this.isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
    this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'ADMIN'));
  }

  login(credenciais: LoginRequest): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth`, credenciais).pipe(
      // ✅ CORREÇÃO: Usamos 'response.accessToken'
      tap(response => localStorage.setItem('auth-token', response.accessToken)),
      switchMap(response => {
        try {
          // ✅ CORREÇÃO: Descodificamos o 'response.accessToken'
          const decodedToken = jwtDecode<DecodedToken>(response.accessToken);
          const userId = decodedToken.sub;
          return this.fetchUserProfile(userId);
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

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.sub;
        this.fetchUserProfile(userId).subscribe({
          next: user => {
            this.currentUserSubject.next(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
          },
          error: () => this.logout()
        });
      } catch (error) {
        this.logout();
      }
    } else {
      this.logout();
    }
  }
  
  private fetchUserProfile(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  // ... outros métodos ...
  signup(data: UserSignup): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, data);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<void> {
    const resetPasswordRequest = {
      novaSenha: newPassword,
      confirmarSenha: confirmPassword
    };
    return this.http.post<void>(`${this.apiUrl}/auth/reset-password?token=${token}`, resetPasswordRequest);
  }
}
