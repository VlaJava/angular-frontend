import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, Sender } from '../../types/chatbot.types';
import { MessageComponent } from '../message/message.component'; // Reutilizando o componente de mensagem
import { SuperChatService } from '../../services/super-chatbot.service';

@Component({
  selector: 'app-super-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './super-chatbot.component.html',
  styleUrls: ['./super-chatbot.component.scss']
})
export class SuperChatbotComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  messages: ChatMessage[] = [{
    text: 'Olá! Sou o Super Avanildo. Posso analisar os dados do sistema para você. O que gostaria de saber?',
    sender: Sender.Bot
  }];
  currentMessage = '';

  constructor(private superChatService: SuperChatService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    const userMessageText = this.currentMessage;
    this.messages.push({ text: userMessageText, sender: Sender.User });
    this.currentMessage = '';

    this.messages.push({ sender: Sender.Bot, isLoading: true });

    this.superChatService.sendMessage(userMessageText, this.messages).subscribe({
      next: (response) => {
        this.messages = this.messages.filter(msg => !msg.isLoading);
        this.messages.push({ text: response.text, sender: Sender.Bot });
      },
      error: () => {
        this.messages = this.messages.filter(msg => !msg.isLoading);
        this.messages.push({ text: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.', sender: Sender.Bot });
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}