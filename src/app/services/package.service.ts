import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Package } from '../types/package.type';
import { environment } from '../../environments/environment';

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

  // Função auxiliar para construir a URL completa da imagem
  private buildPackageWithImageUrl(pkg: Package): Package {
    // Se a URL já for completa, não faz nada
    if (pkg.imageUrl && pkg.imageUrl.startsWith('http')) {
      return pkg;
    }
    // Se não, constrói a URL a partir do backend
    const newImageUrl = `${this.apiUrl}/${pkg.id}/image?v=${new Date().getTime()}`;
    return { ...pkg, imageUrl: newImageUrl };
  }

  // ======================================================================
  // |||||||||||||||||||| MÉTODO GETPACKAGES AJUSTADO ||||||||||||||||||||
  // ======================================================================
  getPackages(
    page: number = 0,
    size: number = 6,
    filters: any = {} // <-- Aceita um objeto de filtros
  ): Observable<PaginatedPackagesResponse> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    let targetUrl = this.apiUrl;
    let hasFilters = false;

    // Constrói os parâmetros dinamicamente a partir do objeto de filtros
    if (filters.source && filters.source.trim() !== '') {
      params = params.append('source', filters.source);
      hasFilters = true;
    }
    if (filters.destination && filters.destination.trim() !== '') {
      params = params.append('destination', filters.destination);
      hasFilters = true;
    }
    if (filters.startDate) {
      params = params.append('startDate', filters.startDate);
      hasFilters = true;
    }
    if (filters.endDate) {
      params = params.append('endDate', filters.endDate);
      hasFilters = true;
    }
    // Consideramos o preço apenas se for menor que o máximo
    if (filters.price && filters.price < 15000) { 
      params = params.append('price', filters.price);
      hasFilters = true;
    }

    // Se houver qualquer filtro, usamos o endpoint /filter
    if (hasFilters) {
      targetUrl = `${this.apiUrl}/filter`;
    }
    
    // A requisição é feita aqui, com a URL e os parâmetros corretos
    return this.http.get<PaginatedPackagesResponse>(targetUrl, { params }).pipe(
      map(response => {
        // Mapeia a resposta para construir a URL das imagens
        const updatedContent = response.content.map(pkg => this.buildPackageWithImageUrl(pkg));
        return { ...response, content: updatedContent };
      })
    );
  }
  // ======================================================================
  // |||||||||||||||||||| FIM DO MÉTODO AJUSTADO ||||||||||||||||||||
  // ======================================================================


  getPackageById(id: string): Observable<Package> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Package>(url).pipe(
      map(pkg => this.buildPackageWithImageUrl(pkg))
    );
  }

  createPackage(packageData: Omit<Package, 'id' | 'imageUrl'>): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, packageData);
  }

  updatePackage(id: string, packageData: Partial<Package>): Observable<Package> {
    return this.http.put<Package>(`${this.apiUrl}/${id}`, packageData);
  }

  uploadPackageImage(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}/${id}/update-image`;
    return this.http.patch(url, formData, { responseType: 'text' });
  }

  deletePackage(packageId: string): Observable<void> {
    const url = `${this.apiUrl}/${packageId}`;
    return this.http.delete<void>(url);
  }
}