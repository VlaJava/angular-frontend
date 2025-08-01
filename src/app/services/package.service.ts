import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getPackages(): Observable<Package[]> {
    return this.http.get<PaginatedPackagesResponse>(this.apiUrl).pipe(
      map(response =>
        response.content.map(pkg => this.buildPackageWithImageUrl(pkg))
      )
    );
  }

  getPackageById(id: string): Observable<Package> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Package>(url).pipe(
      map(pkg => this.buildPackageWithImageUrl(pkg))
    );
  }

  createPackage(newPackage: Omit<Package, 'id'>): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, newPackage).pipe(
      map(pkg => this.buildPackageWithImageUrl(pkg))
    );
  }

  updatePackage(id: string, packageData: Omit<Package, 'id'>): Observable<Package> {
    return this.http.put<Package>(`${this.apiUrl}/${id}`, packageData).pipe(
      map(pkg => this.buildPackageWithImageUrl(pkg))
    );
  }

  deletePackage(packageId: string): Observable<void> {
    const url = `${this.apiUrl}/${packageId}`;
    return this.http.delete<void>(url);
  }

  //coloquei isso daqui
  private buildPackageWithImageUrl(pkg: Package): Package {
    const imageUrl = `${this.apiUrl}/${pkg.id}/image?v=${new Date().getTime()}`;
    return { ...pkg, imageUrl };
  }
}
