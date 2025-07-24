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
    // Tenta carregar o usuário do localStorage ao iniciar
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }

    this.isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
    // Verificação de 'admin' agora é case-insensitive para ser mais robusta
    this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role?.toLowerCase() === 'admin'));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.loginService.login(email, password).pipe(
      tap((response) => {
        // Extrai as informações do usuário da resposta do login
        const user: User = {
            name: response.name,
            role: response.role
        };
        // Atualiza o estado da aplicação e o localStorage
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('auth-token', response.token);
      })
    );
  }

  /**
   * Ajustado: O método de signup agora apenas realiza o cadastro.
   * O login automático foi removido, pois o backend requer confirmação de e-mail
   * antes que o usuário possa fazer login.
   */
  signup(data: UserSignup): Observable<any> { // Pode ser CreateUserResponse
    return this.loginService.signup(data);
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