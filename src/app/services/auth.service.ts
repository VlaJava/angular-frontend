import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';


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

  // ✅ CORREÇÃO: Removemos o LoginService, pois o AuthService fará tudo.
  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }

    this.isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
    this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role?.toLowerCase() === 'admin'));
  }

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth`, credenciais).pipe(
      tap((response) => {
     
        const user: User = {
            name: response.name,
            role: response.role
        };
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('auth-token', response.token);
      })
    );
  }

  signup(data: UserSignup): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, data);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/signup/reset-password`, { email });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<void> {
    const resetPasswordRequest = {
      novaSenha: newPassword,
      confirmarSenha: confirmPassword
    };
    return this.http.post<void>(`${this.apiUrl}/auth/forgot-password?token=${token}`, resetPasswordRequest);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth-token');
    this.currentUserSubject.next(null);
  }


  // LOGIN SIMULADORES 
  loginAsUser(): void {
    const mockUser: User = { name: 'Usuário Simulado', role: 'user' };
    this.currentUserSubject.next(mockUser);
  }

  
  loginAsAdmin(): void {
    const mockAdmin: User = { name: 'Admin Simulado', role: 'admin' };
    this.currentUserSubject.next(mockAdmin);
  }
  
}