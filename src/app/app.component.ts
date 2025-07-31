import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { TravelService } from './services/travel.service';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ChatIconComponent } from './components/chat-icon/chat-icon.component';
import { TravelPackage } from './types/travel.types';

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
  // ✅ Toda a lógica do seu chatbot foi movida para cá
  isChatOpen = false;
  packages: TravelPackage[] = [];
  loading = true; // Você pode usar este estado para outras coisas também
  error: string | null = null;

  constructor(private travelService: TravelService) {
    this.loadPackages();
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