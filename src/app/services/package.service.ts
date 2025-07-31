import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Package } from '../types/package.type';
import { environment } from '../../environments/environment';

// Interface para descrever a estrutura da resposta paginada da sua API
export interface PaginatedPackagesResponse {
  content: Package[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  private readonly apiUrl = `${environment.apiUrl}/packages`;

  constructor(private http: HttpClient) { }

  /**
   * Busca os pacotes do backend.
   * A resposta da API é um objeto paginado, então usamos o operador 'map'
   * para extrair apenas o array 'content' que contém os pacotes.
   */
  getPackages(): Observable<Package[]> {
    return this.http.get<PaginatedPackagesResponse>(this.apiUrl).pipe(
      map(response => response.content)
    );
  }

  /**
   * Busca um único pacote pelo seu ID.
   */
  getPackageById(id: string): Observable<Package> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Package>(url);
  }

  /**
   * Cria um novo pacote no backend.
   */
  createPackage(newPackage: Omit<Package, 'id'>): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, newPackage);
  }

  /**
   * Atualiza um pacote existente.
   */
 updatePackage(id: string, packageData: Omit<Package, 'id'>): Observable<Package> {
    return this.http.put<Package>(`${this.apiUrl}/${id}`, packageData);
  }
  /**
   * Deleta um pacote pelo seu ID.
   */
  deletePackage(packageId: string): Observable<void> {
    const url = `${this.apiUrl}/${packageId}`;
    return this.http.delete<void>(url);
  }
}
