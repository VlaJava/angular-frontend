import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation, ReservationStatus } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private mockReservations: Reservation[] = [
   
    {
      id: 1,
      title: 'Belezas de Noronha',
      location: 'Recife → Fernando de Noronha',
      imageUrl: 'assets/mock/nORONHA.jpg',
      travelDate: new Date('2025-07-10T03:00:00Z'),
      price: 4500.00,
      status: ReservationStatus.Pendente
    },
    {
      id: 2,
      title: 'Tesouros do Jalapão',
      location: 'Palmas → Jalapão',
      imageUrl: 'assets/mock/jalapao.jpg',
      travelDate: new Date('2025-08-09T03:00:00Z'),
      price: 3800.00,
      status: ReservationStatus.Confirmado,
      paymentDate: new Date('2025-08-08T03:00:00Z'),
      paymentMethod: 'Cartão de Crédito' 
    },
    
    {
      id: 3,
      title: 'Belezas de Noronha',
      location: 'Recife → Fernando de Noronha',
      imageUrl: 'assets/mock/nORONHA.jpg',
      travelDate: new Date('2025-06-18T03:00:00Z'),
      price: 4500.00,
      status: ReservationStatus.Cancelado
    }
  ];

  constructor() { }

  getReservations(): Observable<Reservation[]> {
    return of(this.mockReservations);
  }

  cancelReservation(id: number): void {
    console.log(`Reserva com ID: ${id} foi enviada para cancelamento.`);
  }
}