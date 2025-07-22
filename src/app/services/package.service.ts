import { Injectable } from '@angular/core';

// improt interface de PacoteViagem
import { PacoteViagem } from '../models/pacote-viagem';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  // array de pacotes
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

  // Método que retorna todos os pacotes
  getPackages(): PacoteViagem[] {
    return this.pacotes;
  }

  // Método que encontra e retorna um pacote pelo ID
  getPackageById(id: number): PacoteViagem | undefined {
    return this.pacotes.find(p => p.id === id);
  }
}