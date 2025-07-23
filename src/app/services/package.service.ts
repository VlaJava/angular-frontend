import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Package } from '../models/package-modal';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  // Nossa "base de dados" em memória
  private packages: Package[] = [
    { id: '1', titulo: 'Aventura na Patagônia', destino: 'Patagônia, Chile', valor: 7500.00, disponivel: true },
    { id: '2', titulo: 'Praias Paradisíacas de Bali', destino: 'Bali, Indonésia', valor: 9800.00, disponivel: true },
    { id: '3', titulo: 'Luzes de Tóquio', destino: 'Tóquio, Japão', valor: 12300.00, disponivel: false },
    { id: '4', titulo: 'Safari no Serengeti', destino: 'Serengeti, Tanzânia', valor: 15000.00, disponivel: false }
  ];

  constructor() { }

  /**
   * Simula a busca de todos os pacotes.
   * Retorna um Observable para imitar uma chamada de API.
   */
  getPackages(): Observable<Package[]> {
   
    return of(this.packages).pipe(delay(500));
  }

  // Simula a criação de um novo pacote.
   
  createPackage(newPackage: Package): Observable<Package> {
    const createdPackage = {
      ...newPackage,
      id: Math.random().toString(36).substring(2, 9) 
    };
    this.packages.push(createdPackage);
    return of(createdPackage).pipe(delay(500));
  }


  updatePackage(updatedPackage: Package): Observable<Package> {
    const index = this.packages.findIndex(p => p.id === updatedPackage.id);
    if (index !== -1) {
      this.packages[index] = updatedPackage;
      return of(updatedPackage).pipe(delay(500));
    }
    return throwError(() => new Error('Pacote não encontrado'));
  }

  
  deletePackage(packageId: string): Observable<void> {
    this.packages = this.packages.filter(p => p.id !== packageId);
    return of(undefined).pipe(delay(500)); 
  }
}
