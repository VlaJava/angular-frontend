import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../types/user.type';

interface UserResponse {
  content: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(searchTerm: string = ''): Observable<User[]> {
    const options = searchTerm ? { params: new HttpParams().set('search', searchTerm) } : {};
    return this.http.get<UserResponse>(this.apiUrl, options).pipe(
      map(response => response.content)
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateUser(id: string | number, updatedData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, updatedData);
  }
  
  
  uploadProfilePicture(id: string | number, file: File): Observable<any> {
    const formData = new FormData();
    
    formData.append('file', file, file.name); 

   
    return this.http.patch(`${this.apiUrl}/${id}/update-image`, formData, { responseType: 'blob' });
  }

  toggleUserActiveStatus(id: string | number, newStatus: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, { active: newStatus });
  }

  deleteUser(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
