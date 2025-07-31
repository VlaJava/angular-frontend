import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChatMessage, TravelPackage } from '../types/chatbot.types'; 

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
    
    const simplifiedHistory = history
      .filter(msg => msg.text && !msg.isLoading) 
      .map(msg => ({                          
        sender: msg.sender.toString(),        
        text: msg.text
      }));

  
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