import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';


export interface ChartData {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  
  getGeneralStats(): Observable<{ totalUsers: number; totalPackages: number; totalRevenue: number }> {
    const stats = {
      totalUsers: 19,
      totalPackages: 42,
      totalRevenue: 58340.50
    };
    return of(stats).pipe(delay(500)); 
  }

  
  getPackagesByDestination(): Observable<ChartData[]> {
    const data: ChartData[] = [
      { name: 'Salvador', value: 8 },
      { name: 'Rio de Janeiro', value: 12 },
      { name: 'Amazônia', value: 5 },
      { name: 'São Paulo', value: 10 },
      { name: 'Recife', value: 7 },
    ];
    return of(data).pipe(delay(800));
  }

  
  getUsersByStatus(): Observable<ChartData[]> {
    const data: ChartData[] = [
      { name: 'Ativos', value: 15 },
      { name: 'Inativos', value: 4 }
    ];
    return of(data).pipe(delay(1000));
  }
}
