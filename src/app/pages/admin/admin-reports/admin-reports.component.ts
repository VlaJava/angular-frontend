import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperChatbotComponent } from '../../../components/super-chatbot/super-chatbot.component'; // Importe o novo componente

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, SuperChatbotComponent], // Adicione aos imports
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent {
  selectedReport: string = 'packages'; // Valor inicial do select
  isSuperChatOpen = false;

  exportReport(): void {
    // Lógica para exportar o relatório selecionado (ex: CSV, PDF)
    alert(`Exportando relatório de: ${this.selectedReport}`);
  }

  toggleSuperChat(): void {
    this.isSuperChatOpen = !this.isSuperChatOpen;
  }
}
