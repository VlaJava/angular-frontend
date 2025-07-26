import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../types/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
    
  }
  
 
  createUser(userData: Omit<User, 'id' | 'active'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

 
  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}