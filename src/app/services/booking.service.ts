import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Importe o environment

// Supondo que a resposta para uma reserva seja algo assim
interface Booking {
  id: string;
  packageId: string;
  // ... outras propriedades
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; 

  constructor() { }

  checkIfBookingExists(packageId: string): Observable<boolean> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/user`).pipe(
      map(bookings => bookings.some(booking => booking.packageId === packageId)),
      catchError(() => of(false))
    );
  }
}