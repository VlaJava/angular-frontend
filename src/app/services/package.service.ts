import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Package } from '../models/package-modal';


// improt interface de PacoteViagem
import { PacoteViagem } from '../models/pacote-viagem';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  private packages: Package[] = [
    { id: '1', titulo: 'Aventura na Patagônia', destino: 'Patagônia, Chile', valor: 7500.00, disponivel: true },
    { id: '2', titulo: 'Praias Paradisíacas de Bali', destino: 'Bali, Indonésia', valor: 9800.00, disponivel: true },
    { id: '3', titulo: 'Luzes de Tóquio', destino: 'Tóquio, Japão', valor: 12300.00, disponivel: false },
    { id: '4', titulo: 'Safari no Serengeti', destino: 'Serengeti, Tanzânia', valor: 15000.00, disponivel: false }

  private pacotes: PacoteViagem[] = [
    {
      id: 1,
      imagem: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjA5fDB8MXxjb2xsZWN0aW9ufDF8MjY3NTk5fHx8fHwyfHwxNjI5MDY5MjY3&ixlib=rb-1.2.1&q=80&w=400', // URL de exemplo
      preco: 4500,
      titulo: 'Aventura na Amazônia',
      localizacao: 'São Paulo, Brasil -> Manaus, Brasil',
      duracao: '8 Dias / 7 Noites',
      descricao: 'Lorem ipsum dolor sit amet. Ut autem cupiditate qui internos facilis aut dolorem fuga in galisum autem ut eius iure ut fugiat rerum. In totam adipisci et omnia dolorem non fuga quaerat et quia atque.',
      reviews: 1
    },
    {
      id: 2,
      imagem: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjA5fDB8MXxjb2xsZWN0aW9ufDF8NzYyODQ2fHx8fHwyfHwxNjI5MDY5MjY3&ixlib=rb-1.2.1&q=80&w=400', // URL de exemplo
      preco: 7800,
      titulo: 'Sol e Mar em Fernando de Noronha',
      localizacao: 'Recife, Brasil -> Fernando de Noronha, Brasil',
      duracao: '8 Dias / 7 Noites',
      descricao: 'Lorem ipsum dolor sit amet. Ut autem cupiditate qui internos facilis aut dolorem fuga in galisum autem ut eius iure ut fugiat rerum. In totam adipisci et omnia dolorem non fuga quaerat et quia atque.',
      reviews: 1
    },
    {
      id: 3,
      imagem: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjA5fDB8MXxjb2xsZWN0aW9ufDF8MTA2NTYwNnx8fHx8Mnx8MTYyOTA2OTI2Nw&ixlib=rb-1.2.1&q=80&w=400', // URL de exemplo
      preco: 9500,
      titulo: 'Cultura e Vinho na Toscana',
      localizacao: 'Lisboa, Portugal -> Florença, Itália',
      duracao: '11 Dias / 10 Noites',
      descricao: 'Lorem ipsum dolor sit amet. Ut autem cupiditate qui internos facilis aut dolorem fuga in galisum autem ut eius iure ut fugiat rerum. In totam adipisci et omnia dolorem non fuga quaerat et quia atque.',
      reviews: 1
    }

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

  // Método que retorna todos os pacotes
  getPackages(): PacoteViagem[] {
    return this.pacotes;
  }

  // Método que encontra e retorna um pacote pelo ID
  getPackageById(id: number): PacoteViagem | undefined {
    return this.pacotes.find(p => p.id === id);
  }
}

