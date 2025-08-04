import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chat-icon',
    imports: [CommonModule],
    templateUrl: './chat-icon.component.html',
    styleUrls: ['./chat-icon.component.scss']
})
export class ChatIconComponent {
  @Output() onClick = new EventEmitter<void>();
}
