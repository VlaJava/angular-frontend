import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { TravelPackage } from '../types/chatbot.types';
import { environment } from '../../environments/environment';

interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private apiUrl = `${environment.apiUrl}/pakacges`;

  constructor(private http: HttpClient) {}

  getPackages(): Observable<TravelPackage[]> {
    return this.http.get<PaginatedResponse<TravelPackage>>(this.apiUrl).pipe(
      map((response: PaginatedResponse<TravelPackage>) => response.content),
      catchError((error: any) => {
        console.error('Error fetching packages:', error);
        return of([]);
      })
    );
  }
}
