import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
// AJUSTE: Importações necessárias para o layout dinâmico
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TravelService } from './services/travel.service';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ChatIconComponent } from './components/chat-icon/chat-icon.component';
import { TravelPackage } from './types/chatbot.types';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        ChatbotComponent,
        ChatIconComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'projeto_viajava_frontend';
  
  // Lógica do chatbot (mantida)
  isChatOpen = false;
  packages: TravelPackage[] = [];
  loading = true;
  error: string | null = null;

  // AJUSTE: Propriedade para controlar o layout da homepage
  isHomePage = false;

  // AJUSTE: Injetar o Router junto com o TravelService
  constructor(
    private travelService: TravelService, 
    private router: Router
  ) {
    this.loadPackages();

    // AJUSTE: Lógica para detectar a rota e deixar o layout dinâmico
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Define a propriedade como 'true' se a URL for a raiz ('/'), e 'false' caso contrário
      this.isHomePage = event.urlAfterRedirects === '/';
    });
  }

  get availablePackages(): TravelPackage[] {
    return this.packages.filter(p => p.available);
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  private loadPackages() {
    this.loading = true;
    this.error = null;
    
    this.travelService.getPackages().subscribe({
      next: (packages) => {
        this.packages = packages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar os pacotes. Tente novamente mais tarde.';
        this.loading = false;
        console.error('Erro ao carregar pacotes:', err);
      }
    });
  }
}