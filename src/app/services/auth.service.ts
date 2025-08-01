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
  sub: string;
  scope: string;
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
    this.isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
    this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'ADMIN'));
  }
  
  
  private buildUserWithImageUrl(user: User): User {
  
    const imageUrl = `${this.apiUrl}/users/${user.id}/image?v=${new Date().getTime()}`;
    
    
    return { ...user, imageUrl };
  }

  public initUser(): Promise<any> {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.sub;
        return lastValueFrom(
          this.refreshUserProfile(userId).pipe(
            catchError(() => {
              this.logout();
              return of(null);
            })
          )
        );
      } catch (error) {
        this.logout();
        return Promise.resolve();
      }
    } else {
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
        const decodedToken = jwtDecode<DecodedToken>(response.accessToken);
        return this.refreshUserProfile(decodedToken.sub);
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

  public refreshUserProfile(id: string): Observable<User> {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      return throwError(() => new Error('No auth token found'));
    }
    const userRole = jwtDecode<DecodedToken>(token).scope as 'ADMIN' | 'CLIENT';
    
    return this.fetchUserProfile(id).pipe(
      map(userProfile => {
        
        const userWithRole = { ...userProfile, role: userRole };
        return this.buildUserWithImageUrl(userWithRole);
      }),
      tap(finalUserObject => {
        
        this.currentUserSubject.next(finalUserObject);
        localStorage.setItem('currentUser', JSON.stringify(finalUserObject));
      })
    );
  }

signup(data: UserSignup): Observable<any> {
    return this.getHttp().post<any>(`${this.apiUrl}/users`, data);
  }

  
confirmAccount(token: string): Observable<void> {
  return this.getHttp().get<void>(`${this.apiUrl}/auth/signup/account-confirmation?token=${token}`, {});
}

forgotPassword(email: string): Observable<void> {
  
    return this.getHttp().post<void>(`${this.apiUrl}/auth/signup/reset-password`, { email });
  }

 
  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<void> {
    const body = {
      password: newPassword,
      passwordConfirmation: confirmPassword
    };
    
    return this.getHttp().post<void>(`${this.apiUrl}/auth/forgot-password?token=${token}`, body);
  }
}
