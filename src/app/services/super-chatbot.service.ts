import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChatMessage} from '../types/chatbot.types'; 

export interface SuperChatResponse {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuperChatService {
  private apiUrl = `${environment.apiUrl}/chat/super`;

  constructor(private http: HttpClient) { }

  sendMessage(message: string, history: ChatMessage[]): Observable<SuperChatResponse> {
    // Simplifica o histórico para o formato que o backend espera
    const simplifiedHistory = history
      .filter(msg => msg.text && !msg.isLoading)
      .map(msg => ({
        sender: msg.sender.toString(),
        text: msg.text
      }));

    const body = { message, history: simplifiedHistory };

    return this.http.post<SuperChatResponse>(this.apiUrl, body).pipe(
      catchError(error => {
        console.error('Erro ao comunicar com o Super Avanildo:', error);
        const errorResponse: SuperChatResponse = { 
            text: 'Desculpe, estou com dificuldades para acessar os dados do sistema no momento.'
        };
        return of(errorResponse);
      })
    );
  }
}