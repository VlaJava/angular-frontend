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

  private buildPackageWithImageUrl(pkg: Package): Package {
    if (!pkg.imageUrl || typeof pkg.imageUrl !== 'string' || pkg.imageUrl.trim() === '') {
      return pkg;
    }
    try {
      new URL(pkg.imageUrl);
      return pkg;
    } catch (_) {
      const newImageUrl = `${this.apiUrl}/${pkg.id}/image?v=${new Date().getTime()}`;
      return { ...pkg, imageUrl: newImageUrl };
    }
  }
  getPackages(page: number = 0, size: number = 6): Observable<PaginatedPackagesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedPackagesResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        const updatedContent = response.content.map(pkg => this.buildPackageWithImageUrl(pkg));
        return { ...response, content: updatedContent };
      })
    );
  }

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
    formData.append('image', file, file.name);
    return this.http.post(`${this.apiUrl}/${id}/image`, formData);
  }

  deletePackage(packageId: string): Observable<void> {
    const url = `${this.apiUrl}/${packageId}`;
    return this.http.delete<void>(url);
  }
}