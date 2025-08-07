import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Reservation, ReservationStatus } from '../../models/reservation.model';
import { CommonModule } from '@angular/common';

@Component({
   standalone: true, // Essencial para a arquitetura standalone
  imports: [
    CommonModule // Necessário para usar diretivas como *ngIf, *ngFor, [ngClass] e pipes como date e currency
  ],
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss']
})
export class ReservationCardComponent {
  // Recebe os dados da reserva do componente pai
  @Input() reservation!: Reservation;

  // Envia um evento para o componente pai quando o cancelamento é solicitado
  @Output() cancel = new EventEmitter<number>();

  // Expõe o enum para o template poder usá-lo
  ReservationStatus = ReservationStatus;

  // Função para emitir o evento de cancelamento com o ID da reserva
  onCancel(): void {
    this.cancel.emit(this.reservation.id);
  }
}