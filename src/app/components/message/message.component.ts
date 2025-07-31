import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage, Sender } from '../../types/chatbot.types';
import { PackageCardComponent } from '../package-card-chat/package-card-chat.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, PackageCardComponent],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message!: ChatMessage;

  get isBot(): boolean {
    return this.message.sender === Sender.Bot;
  }
}
