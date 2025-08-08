import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperChatbotComponent } from '../../../components/super-chatbot/super-chatbot.component'; // Importe o novo componente

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, SuperChatbotComponent],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent {
  selectedReport: string = 'salesPerformance'; // Valor inicial do select

   showChatbot = false; // ← novo

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
  }

  exportReport(): void {
    let data: any[] = [];
    let headers: string[] = [];
    let filename: string = 'relatorio.csv';

    switch (this.selectedReport) {
      case 'salesPerformance':
        headers = ['Mes', 'Pacote', 'ReservasConfirmadas', 'ReceitaTotal'];
        data = this._generateSalesPerformanceReport();
        filename = 'desempenho_vendas.csv';
        break;
      case 'packagePerformance':
        headers = ['Pacote', 'Destino', 'Preco', 'VagasTotais', 'VagasOcupadas', 'TaxaOcupacao', 'ReceitaGerada'];
        data = this._generatePackagePerformanceReport();
        filename = 'desempenho_pacotes.csv';
        break;
      case 'customerValue':
        headers = ['ClienteID', 'Nome', 'Email', 'TotalReservas', 'GastoTotal', 'UltimaReserva'];
        data = this._generateCustomerValueReport();
        filename = 'valor_clientes.csv';
        break;
      case 'pendingPayments':
        headers = ['ReservaID', 'Cliente', 'Pacote', 'ValorPendente', 'DataVencimento', 'MetodoPagamento'];
        data = this._generatePendingPaymentsReport();
        filename = 'pagamentos_pendentes.csv';
        break;
    }

    this._downloadCSV(data, headers, filename);
  }

  private _downloadCSV(data: any[], headers: string[], filename: string): void {
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const item of data) {
      const values = headers.map(header => {
        // Converte o nome do cabeçalho para minúsculas para corresponder às chaves do objeto
        const key = header.toLowerCase();
        const escaped = ('' + item[key]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // --- Métodos de Geração de Dados de Exemplo ---

  private _generateSalesPerformanceReport() {
    return [
      { mes: 'Julho 2025', pacote: 'Neve em Bariloche', reservasconfirmadas: 8, receitatotal: '36000.00' },
      { mes: 'Julho 2025', pacote: 'Praias do Caribe', reservasconfirmadas: 4, receitatotal: '31202.00' },
      { mes: 'Junho 2025', pacote: 'Neve em Bariloche', reservasconfirmadas: 12, receitatotal: '54000.00' },
      { mes: 'Junho 2025', pacote: 'Aventura na Amazônia', reservasconfirmadas: 5, receitatotal: '16000.00' },
      { mes: 'Maio 2025', pacote: 'Cultura Japonesa', reservasconfirmadas: 3, receitatotal: '45000.00' }
    ];
  }

  private _generatePackagePerformanceReport() {
    return [
      { pacote: 'Neve em Bariloche', destino: 'Bariloche, AR', preco: '4500.00', vagastotais: 20, vagasocupadas: 18, taxaocupacao: '90%', receitagerada: '81000.00' },
      { pacote: 'Praias do Caribe', destino: 'Cancún, MX', preco: '7800.50', vagastotais: 15, vagasocupadas: 9, taxaocupacao: '60%', receitagerada: '70204.50' },
      { pacote: 'Aventura na Amazônia', destino: 'Manaus, BR', preco: '3200.00', vagastotais: 25, vagasocupadas: 7, taxaocupacao: '28%', receitagerada: '22400.00' },
      { pacote: 'Cultura Japonesa', destino: 'Tóquio, JP', preco: '15000.00', vagastotais: 10, vagasocupadas: 3, taxaocupacao: '30%', receitagerada: '45000.00' }
    ];
  }

  private _generateCustomerValueReport() {
    return [
      { clienteid: 'bd286ae0-db4e-4a90-9bd5-245d9a25adca', nome: 'Ana Pereira', email: 'ana.p@email.com', totalreservas: 3, gastototal: '27300.50', ultimareserva: '2025-07-10' },
      { clienteid: '788bf853-89f6-43f0-a82d-fb04d89899e6', nome: 'Carlos Silva', email: 'carlos.s@email.com', totalreservas: 1, gastototal: '4500.00', ultimareserva: '2025-06-05' },
      { clienteid: '3a998cb0-3c4c-408c-8913-25ee97095217', nome: 'Maria Oliveira', email: 'maria.o@email.com', totalreservas: 2, gastototal: '11000.50', ultimareserva: '2025-07-22' }
    ];
  }

  private _generatePendingPaymentsReport() {
    return [
      { reservaid: '13a5ce4c-831a-4dee-8ba5-bde7c55c1006', cliente: 'Lucas Martins', pacote: 'Neve em Bariloche', valorpendente: '2250.00', datavencimento: '2025-08-15', metodopagamento: 'BOLETO' },
      { reservaid: '82326843-c674-4b15-a9aa-30024c353123', cliente: 'Juliana Costa', pacote: 'Praias do Caribe', valorpendente: '7800.50', datavencimento: '2025-08-10', metodopagamento: 'CREDIT' }
    ];
  }
}