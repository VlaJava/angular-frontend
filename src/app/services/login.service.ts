import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../types/login-response.type';
import { UserSignup } from '../types/user-signup.type';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = "http://localhost:8080/api"

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  
  signup(data: UserSignup) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/register`, data);
  }

  forgotPassword(email: string) {
   
    return this.httpClient.post<unknown>(`${this.apiUrl}/forgot-password`, { email });
  }
}