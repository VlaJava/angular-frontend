import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../types/login-response.type';
import { UserSignup } from '../types/user-signup.type';
import { CreateUserResponse } from '../types/create-user-response.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  
  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/auth`, { email, password });
  }

  
  signup(data: UserSignup) {
  
    return this.httpClient.post<CreateUserResponse>(`${this.apiUrl}/usuarios`, data);
  }

  
  forgotPassword(email: string) {
    return this.httpClient.post<unknown>(`${this.apiUrl}/auth/signup/resetar-senha`, { email });
  }

  
  resetPassword(token: string, newPassword: string) {
    const requestBody = { senha: newPassword, confirmarSenha: newPassword };
    return this.httpClient.post<unknown>(`${this.apiUrl}/auth/forgot-password?token=${token}`, requestBody);
  }
}
