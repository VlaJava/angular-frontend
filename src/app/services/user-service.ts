import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../types/user.type';
import { PaginatedResponse, UserResponse } from '../pages/admin/admin-users/admin-users.component';
 
 
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
 
  constructor(private http: HttpClient) { }
 
 
  getUsers(searchTerm: string = ''): Observable<PaginatedResponse<UserResponse>> {
    const options = searchTerm ? { params: new HttpParams().set('search', searchTerm) } : {};
    return this.http.get<PaginatedResponse<UserResponse>>(this.apiUrl, options);
  }
 
  
  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }
 

  updateUser(id: string, updatedData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, updatedData);
  }

 uploadProfilePicture(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name); 
  return this.http.patch(`${this.apiUrl}/${id}/update-image`, formData, { responseType: 'blob' });
 }

  toggleUserActiveStatus(id: string, newStatus: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, { active: newStatus });
  }
 

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}