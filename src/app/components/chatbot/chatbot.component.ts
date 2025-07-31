import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, Sender, TravelPackage } from '../../types/travel.types';
import { MessageComponent } from '../message/message.component';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  @Input() isOpen = false;
  // ✅ O input de pacotes pode continuar existindo se você usá-lo para outra coisa,
  // mas ele NÃO é mais necessário para a lógica do chat.
  @Input() packages: TravelPackage[] = []; 
  @Output() onClose = new EventEmitter<void>();

  messages: ChatMessage[] = [
    {
      text: 'Olá! Eu sou o Avanildo, seu assistente virtual. Como posso ajudar você hoje?',
      sender: Sender.Bot
    }
  ];
  currentMessage = '';

  constructor(private geminiService: GeminiService) {}

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    // Adiciona mensagem do usuário (sem alterações aqui)
    this.messages = [...this.messages, {
      text: this.currentMessage,
      sender: Sender.User
    }];

    // Adiciona mensagem de carregamento do bot (sem alterações aqui)
    this.messages = [...this.messages, {
      sender: Sender.Bot,
      isLoading: true
    }];

    const userMessage = this.currentMessage;
    this.currentMessage = '';

    // ✅ PASSO 1: A CHAMADA PARA O SERVIÇO FICOU MAIS SIMPLES
    // Não passamos mais `this.packages`.
    this.geminiService.sendMessage(userMessage, this.messages).subscribe({
  next: (response) => { // A resposta é um objeto { text, recommendedPackages }
    // Remove mensagem de carregamento
    this.messages = this.messages.filter(m => !m.isLoading);

    // Adiciona resposta de texto do bot
    this.messages = [...this.messages, {
      text: response.text,
      sender: Sender.Bot
    }];

    // ✅ LÓGICA REATIVADA: Se houver pacotes, cria uma nova mensagem para eles
    if (response.recommendedPackages && response.recommendedPackages.length > 0) {
      this.messages = [...this.messages, {
        sender: Sender.Bot,
        packages: response.recommendedPackages
      }];
    }
  },
      error: (errorText) => { // O erro do serviço agora também pode ser uma string
        // Remove mensagem de carregamento
        this.messages = this.messages.filter(m => !m.isLoading);

        // Adiciona mensagem de erro
        this.messages = [...this.messages, {
          text: errorText, // Usa a string de erro do serviço
          sender: Sender.Bot
        }];
      }
    });
  }
}