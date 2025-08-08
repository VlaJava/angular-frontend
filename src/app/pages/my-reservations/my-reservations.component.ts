import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { ReservationCardComponent } from '../../components/reservation-card/reservation-card.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReservationCardComponent // Importe o componente filho aqui!
  ],
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {

  // Usar o pipe 'async' no template é uma ótima prática
  public reservations$!: Observable<Reservation[]>;

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.reservations$ = this.reservationService.getReservations();
  }

  handleCancel(reservationId: number): void {
    // Aqui você chama o serviço para processar o cancelamento
    console.log(`Componente pai recebeu solicitação para cancelar a reserva: ${reservationId}`);
    alert(`Pedido de cancelamento para reserva #${reservationId} enviado!`);
    // this.reservationService.cancelReservation(reservationId);
    // Após cancelar, você pode querer recarregar a lista de reservas.
  }
}