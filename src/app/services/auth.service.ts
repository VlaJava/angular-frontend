import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { LoginService } from './login.service';
import { User } from '../types/user.type';
import { LoginResponse } from '../types/login-response.type';
import { UserSignup } from '../types/user-signup.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;

  constructor(private loginService: LoginService) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
    this.isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
    this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'admin'));
  }

  // --- MÉTODOS REAIS ---
  login(email: string, password: string): Observable<LoginResponse> {
    
    return this.loginService.login(email, password).pipe(
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

  signup(data: UserSignup): Observable<LoginResponse> {

    return this.loginService.signup(data).pipe(
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

  forgotPassword(email: string): Observable<unknown> {
    return this.loginService.forgotPassword(email);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth-token');
    this.currentUserSubject.next(null);
  }

  // --- MÉTODOS DE SIMULAÇÃO PARA TESTES ---
  loginAsUser(): void {
    const mockUser: User = { name: 'Usuário Teste', role: 'user' };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('auth-token', 'mock-user-token');
    this.currentUserSubject.next(mockUser);
  }

  loginAsAdmin(): void {
    const mockAdmin: User = { name: 'Admin Teste', role: 'admin' };
    localStorage.setItem('currentUser', JSON.stringify(mockAdmin));
    localStorage.setItem('auth-token', 'mock-admin-token');
    this.currentUserSubject.next(mockAdmin);
  }
}