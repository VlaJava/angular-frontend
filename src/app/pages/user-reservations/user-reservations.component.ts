import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';


interface PaymentEntity {
  id: number;
  destination: string;
  location: string;
  travelDate: string; 
  value: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  paymentDate?: string; 
  
}

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe], 
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.scss']
})
export class UserReservationsComponent implements OnInit {
  reservations: PaymentEntity[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  selectedStatus: string = ''; 
  currentPage: number = 0;
  pageSize: number = 10;
  canCancelConfirmed: boolean = false; 


  private apiUrl =`${environment.apiUrl}/users/payments`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  
  loadReservations(): void {
    this.isLoading = true;
    this.error = null;

    
    const authToken = 'SEU_TOKEN_DE_AUTENTICACAO_AQUI'; 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    if (this.selectedStatus) {
      params = params.set('status', this.selectedStatus);
    }

    this.http.get<any>(`${this.apiUrl}/user/payments`, { headers, params })
      .pipe(
        map(response => response.content), 
        catchError(err => {
          console.error('Erro ao carregar reservas:', err);
          this.error = 'Não foi possível carregar suas reservas. Tente novamente mais tarde.';
          
          if (err.status === 401 || err.status === 403) {
            this.error = 'Sua sessão expirou ou você não tem permissão. Por favor, faça login novamente.';
           
          }
          return of([]); 
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(data => {
        this.reservations = data;
      });
  }


  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 0; 
    this.loadReservations();
  }

  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'CONFIRMADO';
      case 'PENDING':
        return 'PENDENTE';
      case 'CANCELED':
        return 'CANCELADO';
      default:
        return 'DESCONHECIDO';
    }
  }


  cancelReservation(reservationId: number): void {
   
    const reservationToCancel = this.reservations.find(r => r.id === reservationId);
    if (reservationToCancel) {
      
      reservationToCancel.status = 'CANCELED';
      console.log(`Reserva ${reservationId} cancelada (simulado).`);
      
    }
  }
}