import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Package } from '../types/package.type';

@Injectable({
  providedIn: 'root'
})
export class PackageService {


  // APAGAR DAQUI PRA BAIXO!!!!!
  private packages: Package[] = [
    {
      id: 1, // ✅ ID alterado para number
      titulo: 'Aventura na Patagônia',
      destino: 'Patagônia, Chile',
      localizacao: 'Patagônia, Chile',
      valor: 7500.00,
      preco: 7500.00,
      disponivel: true,
      imagem: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      descricao: 'Explore as paisagens deslumbrantes da Patagônia, com as suas montanhas imponentes e glaciares majestosos.',
      duracao: '10 Dias / 9 Noites',
      reviews: 5
    },
    {
      id: 2, // ✅ ID alterado para number
      titulo: 'Praias Paradisíacas de Bali',
      destino: 'Bali, Indonésia',
      localizacao: 'Bali, Indonésia',
      valor: 9800.00,
      preco: 9800.00,
      disponivel: true,
      imagem: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
      descricao: 'Relaxe nas praias de areia branca, explore templos antigos e mergulhe na cultura vibrante de Bali.',
      duracao: '12 Dias / 11 Noites',
      reviews: 4
    },
    {
      id: 3, // ✅ ID alterado para number
      titulo: 'Luzes de Tóquio',
      destino: 'Tóquio, Japão',
      localizacao: 'Tóquio, Japão',
      valor: 12300.00,
      preco: 12300.00,
      disponivel: false,
      imagem: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      descricao: 'Descubra a metrópole futurista de Tóquio, desde os seus arranha-céus iluminados por néon até aos seus jardins tranquilos.',
      duracao: '8 Dias / 7 Noites',
      reviews: 5
    }
  ];

  constructor() { }

  getPackages(): Observable<Package[]> {
    return of(this.packages).pipe(delay(500));
  }

  // ✅ Assinatura do método alterada para aceitar number
  getPackageById(id: number): Observable<Package | undefined> {
    const foundPackage = this.packages.find(p => p.id === id);
    return of(foundPackage).pipe(delay(200));
  }

  createPackage(newPackage: Package): Observable<Package> {
    const createdPackage = {
      ...newPackage,
      // ✅ Gera um ID numérico aleatório
      id: Math.floor(Math.random() * 10000)
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

  // ✅ Assinatura do método alterada para aceitar number
  deletePackage(packageId: number): Observable<void> {
    this.packages = this.packages.filter(p => p.id !== packageId);
    return of(undefined).pipe(delay(500));
  }
}
/** 
 !!!!!!SÓ DESCOMENTAR E SUBISTITUIR QUANDO TIVER PACOTES REAIS NO BANCO

  
  private readonly apiUrl = `${environment.apiUrl}/pacotes`;

  
  constructor(private http: HttpClient) { }

  
  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl);
  }

  
  getPackageById(id: number): Observable<Package> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Package>(url);
  }

  
  createPackage(newPackage: Omit<Package, 'id'>): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, newPackage);
  }

  
  updatePackage(id: number, updatedPackage: Package): Observable<Package> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Package>(url, updatedPackage);
  }

  
  deletePackage(packageId: number): Observable<void> {
    const url = `${this.apiUrl}/${packageId}`;
    return this.http.delete<void>(url);
  }
}

*/