import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, Sender, TravelPackage } from '../../types/chatbot.types';
import { MessageComponent } from '../message/message.component';
import { GeminiService } from '../../services/gemini.service';


@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  @Input() isOpen = false;
  @Input() packages: TravelPackage[] = [];
  @Output() onClose = new EventEmitter<void>();

  messages: ChatMessage[] = [
    {
      text: 'Olá! Eu sou o Avanildo, seu assistente virtual. Como posso ajudar você hoje?',
      sender: Sender.Bot
    }
  ];
  currentMessage = '';

  private shouldScroll = true; // Flag para controlar o scroll

  constructor(private geminiService: GeminiService) {}

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false; // Reseta a flag após rolar
    }
  }

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    this.messages.push({ text: this.currentMessage, sender: Sender.User });
    const userMessage = this.currentMessage;
    this.currentMessage = '';
    this.shouldScroll = true; // Ativa o scroll para a mensagem do usuário

    this.messages.push({ sender: Sender.Bot, isLoading: true });

    this.geminiService.sendMessage(userMessage, this.messages).subscribe({
      next: (response) => {
        this.messages = this.messages.filter(m => !m.isLoading);
        this.messages.push({ text: response.text, sender: Sender.Bot, packages: response.recommendedPackages });
        this.shouldScroll = true; // Ativa o scroll para a resposta do bot
      },
      error: (errorResponse) => {
        this.messages = this.messages.filter(m => !m.isLoading);
        this.messages.push({ text: errorResponse.text, sender: Sender.Bot });
        this.shouldScroll = true; // Ativa o scroll para a mensagem de erro
      }
    });
  }

  private scrollToBottom(): void {
    try {
      // Adiciona um pequeno atraso para garantir que o DOM foi atualizado
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }, 0);
    } catch(err) { }
  }
}
