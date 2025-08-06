import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// 1. Imports atualizados para o encadeamento
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Traveler {
  name: string;
  document: string;
  birthDate: string;
}

// 2. Interface ajustada para refletir a resposta real da API de /bookings
interface BookingResponse {
  id: string; // O ID da reserva é a informação crucial que precisamos
  userId: string;
  packageId: string;
  totalPrice: number;
  bookingDate: string;
  travelDate: string;
  bookingStatus: string;
  travelers: any[];
}


@Component({
    selector: 'app-booking-finalization',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './booking-finalization.component.html',
    styleUrl: './booking-finalization.component.scss'
})
export class BookingFinalizationComponent {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  // Propriedades do pacote
  packageId: string = '';
  packageTitle: string = '';
  packageDestination: string = '';
  packageDescription: string = '';
  packageValue: number = 0;
  packageImage: string = '';
  packageDays: number = 1;

  // Propriedades do formulário
  startDate: string = '';
  endDate: string = '';
  today: string = new Date().toISOString().split('T')[0];
  isSubmitting = false;
  errorMessage: string | null = null;
  // 3. Nova propriedade para controlar a exibição da tela de sucesso
  bookingSuccess = false;

  travelers: Traveler[] = [{ name: '', document: '', birthDate: '' }];

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.packageId = params['id'] || '';
      this.packageTitle = params['title'] || '';
      this.packageDestination = params['destination'] || '';
      this.packageDescription = params['description'] || '';
      this.packageValue = params['value'] ? Number(params['value']) : 0;
      this.packageImage = params['image'];
      this.packageDays = params['days'] ? Number(params['days']) : 1;

      if (!this.packageId) {
        console.error('Erro: ID do pacote não encontrado nos parâmetros da URL.');
        this.errorMessage = 'Não foi possível carregar os detalhes do pacote. O ID está faltando.';
      }
    });
  }

  addTraveler() {
    this.travelers.push({ name: '', document: '', birthDate: '' });
  }

  removeTraveler(index: number) {
    this.travelers.splice(index, 1);
  }

  // 4. Lógica de finalização de reserva totalmente refeita
  finalizeReservation() {
    if (this.isSubmitting || !this.isFormValid()) {
      if (!this.isFormValid()) {
        this.errorMessage = "Por favor, preencha a data de início e todos os dados dos viajantes.";
      }
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const bookingPayload = {
      packageId: this.packageId,
      travelDate: this.startDate,
      travelers: this.travelers.map(t => ({ name: t.name, document: t.document, birthdate: t.birthDate }))
    };

    
    const apiBaseUrl = `${environment.apiUrl}`;

    
    this.http.post<BookingResponse>(`${apiBaseUrl}/bookings`, bookingPayload).pipe(
      
      switchMap(bookingResponse => {
        console.log('Etapa 1: Reserva criada com sucesso!', bookingResponse);
        const bookingId = bookingResponse.id; 
        const paymentPayload = { booking_id: bookingId };

        console.log('Etapa 2: Enviando ID para iniciar pagamento...', paymentPayload);
        
        return this.http.post(`${apiBaseUrl}/payments/preference`, paymentPayload);
      }),
      
      tap(paymentResponse => {
        console.log('Etapa 2: Resposta do pagamento recebida!', paymentResponse);
        this.isSubmitting = false;
        this.bookingSuccess = true; 
      }),
      
      catchError(error => {
        console.error('Ocorreu um erro no processo de reserva:', error);
        this.errorMessage = `Falha ao processar a reserva. Por favor, tente novamente mais tarde.`;
        this.isSubmitting = false;
        return of(null); 
      })
    ).subscribe();
  }

  isFormValid(): boolean {
    if (!this.startDate) return false;
    for (const traveler of this.travelers) {
      if (!traveler.name || !traveler.document || !traveler.birthDate) {
        return false;
      }
    }
    return true;
  }

  onStartDateChange() {
    if (this.startDate && this.packageDays) {
      const start = new Date(this.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + this.packageDays - 1);
      this.endDate = end.toISOString().split('T')[0];
    } else {
      this.endDate = '';
    }
  }
}