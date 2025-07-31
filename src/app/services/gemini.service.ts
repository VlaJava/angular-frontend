import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChatMessage, TravelPackage } from '../types/travel.types'; // Certifique-se que este import está correto

// A interface agora reflete exatamente o que o backend envia
export interface BotResponse {
  text: string;
  recommendedPackages: TravelPackage[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private chatApiUrl = 'http://localhost:8080/api/v1/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, history: ChatMessage[]): Observable<BotResponse> {
    
    // ✅ A CORREÇÃO ESTÁ AQUI: Mapeamos o histórico para um formato simples
    // que corresponde exatamente ao DTO do backend.
    const simplifiedHistory = history
      .filter(msg => msg.text && !msg.isLoading) // 1. Filtra mensagens de loading ou sem texto
      .map(msg => ({                          // 2. Mapeia para o formato simples
        sender: msg.sender.toString(),        // Garante que o enum 'Sender' seja enviado como string
        text: msg.text
      }));

    // Agora o corpo da requisição contém o histórico no formato correto
    const body = { message, history: simplifiedHistory };

    return this.http.post<BotResponse>(this.chatApiUrl, body).pipe(
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