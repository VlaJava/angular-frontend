import { Component } from '@angular/core';
import { PacoteViagem } from '../../../models/pacote-viagem';
import { CommonModule } from '@angular/common';
import { PackageCardComponent } from '../../../components/package-card/package-card.component'; // 2. IMPORTE O PackageCardComponent

@Component({
  selector: 'app-travel-packages',
  standalone: true,
  imports: [
    CommonModule,
    PackageCardComponent
  ],
  templateUrl: './travel-packages.component.html',
  styleUrls: ['./travel-packages.component.css']
})

export class TravelPackagesComponent {
  // Array com os pacotes de viagem (simulando dados)
  pacotes: PacoteViagem[] = [
    {
      id: 1,
      imagem: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjA5fDB8MXxjb2xsZWN0aW9ufDF8MjY3NTk5fHx8fHwyfHwxNjI5MDY5MjY3&ixlib=rb-1.2.1&q=80&w=400', // URL de exemplo
      preco: 4500,
      titulo: 'Aventura na Amazônia',
      localizacao: 'São Paulo, Brasil -> Manaus, Brasil',
      duracao: '8 Dias / 7 Noites',
      descricao: 'Explore a imensidão da Floresta Amazônica. Navegue por rios sinuosos, descubra a fauna e flora exuberantes e conecte-se com a natureza em seu estado mais puro.',
      reviews: 1
    },
    {
      id: 2,
      imagem: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjA5fDB8MXxjb2xsZWN0aW9ufDF8NzYyODQ2fHx8fHwyfHwxNjI5MDY5MjY3&ixlib=rb-1.2.1&q=80&w=400', // URL de exemplo
      preco: 7800,
      titulo: 'Sol e Mar em Fernando de Noronha',
      localizacao: 'Rio de Janeiro, Brasil -> Fernando de Noronha, Brasil',
      duracao: '8 Dias / 7 Noites',
      descricao: 'Relaxe nas praias mais bonitas do mundo, mergulhe com golfinhos e tartarugas em águas cristalinas e desfrute de um paraíso ecológico inesquecível.',
      reviews: 0
    },
    {
      id: 3,
      imagem: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjA5fDB8MXxjb2xsZWN0aW9ufDF8MTA2NTYwNnx8fHx8Mnx8MTYyOTA2OTI2Nw&ixlib=rb-1.2.1&q=80&w=400', // URL de exemplo
      preco: 9500,
      titulo: 'Cultura e Vinho na Toscana',
      localizacao: 'Lisboa, Portugal -> Florença, Itália',
      duracao: '11 Dias / 10 Noites',
      descricao: 'Imersão renascentista, paisagens de colinas e vinhedos, e a deliciosa gastronomia italiana. Explore cidades históricas e deguste vinhos mundialmente famosos.',
      reviews: 0
    }
    
  ];
}