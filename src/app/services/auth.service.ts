import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, switchMap, of } from 'rxjs';

import { User } from '../types/user.type';
import { LoginResponse } from '../types/login-response.type';
import { UserSignup } from '../types/user-signup.type';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../types/login-request.type';

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
    // Tenta carregar o usuário do navegador ao iniciar a aplicação
    this.loadUserFromStorage();

    // Cria os observables de estado
    this.isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
    this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'ADMIN'));
  }

  /**
   * FLUXO DE LOGIN EM 2 ETAPAS:
   * 1. Chama /auth/login para obter o token.
   * 2. Usa o token para chamar /users/profile e obter os dados completos do usuário.
   */
  login(credenciais: LoginRequest): Observable<User> {
    // Etapa 1: Autenticar e obter o token
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth`, credenciais).pipe(
      // Guarda o token no localStorage assim que ele é recebido
      tap(response => localStorage.setItem('auth-token', response.token)),
      
      // Etapa 2: Usa o token para buscar o perfil completo do usuário
      switchMap(() => this.fetchUserProfile()),
      
      // Guarda o usuário completo e notifica toda a aplicação
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
    
    this.fetchUserProfile().subscribe({
      
      next: user => {
       
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      },
      
      error: () => this.logout() 
    });
  } else {
    
    this.logout(); 
  }
}
  
 
  private fetchUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users`);
  }



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