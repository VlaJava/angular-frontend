
export enum ReservationStatus {
  Pendente = 'PENDENTE',
  Confirmado = 'CONFIRMADO',
  Cancelado = 'CANCELADO'
}

export interface Reservation {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  travelDate: Date;
  price: number;
  status: ReservationStatus;
  paymentDate?: Date; 
  paymentMethod?: string;
}