import { Component, OnInit } from '@angular/core';


import { ChartData, DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { lastValueFrom } from 'rxjs';



@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
      CommonModule,
      NgxChartsModule
      
     ],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  
  generalStats: { totalUsers: number; totalPackages: number; totalRevenue: number } | null = null;

  
  packagesByDestination: ChartData[] = [];
  usersByStatus: ChartData[] = [];
  
  isLoading = true;

  
  view: [number, number] = [700, 400];
  colorScheme: any = {
    domain: ['#0ccbceff', '#9b1010ff', '#02b326ff', '#d94f04', '#a63c06']
  };
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

 // Marque a função como async
async loadDashboardData(): Promise<void> { 
  this.isLoading = true;
  try {
    // Carrega todos os dados em paralelo
    const [stats, packagesData, usersData] = await Promise.all([
      lastValueFrom(this.dashboardService.getGeneralStats()),
      lastValueFrom(this.dashboardService.getPackagesByDestination()),
      lastValueFrom(this.dashboardService.getUsersByStatus())
    ]);

    this.generalStats = stats;
    this.packagesByDestination = packagesData;
    this.usersByStatus = usersData;
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard', error);
    // Opcional: tratar o erro na UI
  } finally {
    this.isLoading = false;
  }
}

  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
}
