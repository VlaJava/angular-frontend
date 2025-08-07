import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Importe o 'map'
import { ChatMessage, TravelPackage } from '../types/chatbot.types';
import { environment } from '../../environments/environment';

export interface BotResponse {
  text: string;
  recommendedPackages: TravelPackage[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private chatApiUrl = `${environment.apiUrl}/chat`;
  // URL base para as imagens, que usa o endpoint de pacotes
  private packagesApiUrl = `${environment.apiUrl}/packages`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string, history: ChatMessage[]): Observable<BotResponse> {
    const simplifiedHistory = history
      .filter(msg => msg.text && !msg.isLoading)
      .map(msg => ({
        sender: msg.sender.toString(),
        text: msg.text
      }));

    const body = { message, history: simplifiedHistory };

    return this.http.post<BotResponse>(this.chatApiUrl, body).pipe(
      // ✅ A CORREÇÃO ESTÁ AQUI
      map(response => {
        // Se a resposta tiver pacotes recomendados...
        if (response.recommendedPackages && response.recommendedPackages.length > 0) {
          // ...percorre cada pacote e constrói a URL completa da imagem,
          // usando a mesma lógica do PackageService.
          response.recommendedPackages.forEach(pkg => {
            // A URL correta aponta para o endpoint de imagem do pacote
            pkg.imageUrl = `${this.packagesApiUrl}/${pkg.id}/image?v=${new Date().getTime()}`;
          });
        }
        return response; // Retorna a resposta com as URLs corrigidas
      }),
      catchError(error => {
        console.error('Erro ao conectar com o backend do chat:', error);
        const errorResponse: BotResponse = {
            text: 'Ops! Parece que estou offline. Tente novamente em alguns instantes.',
            recommendedPackages: []
        };
        return of(errorResponse);
      })
    );
  }
}