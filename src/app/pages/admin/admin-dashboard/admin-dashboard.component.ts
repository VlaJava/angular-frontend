import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importe os módulos de gráficos que vamos usar
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartData } from '../../../services/dashboard.service';


@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, NgxChartsModule], // Adicione NgxChartsModule
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Propriedades para as estatísticas gerais
  generalStats: { totalUsers: number; totalPackages: number; totalRevenue: number } | null = null;

  // Propriedades para os dados dos gráficos
  packagesByDestination: ChartData[] = [];
  usersByStatus: ChartData[] = [];
  
  isLoading = true;

  // Opções de customização dos gráficos
  view: [number, number] = [700, 400];
  colorScheme: any = {
    domain: ['#FF7700', '#2b3d4f', '#f2b705', '#d94f04', '#a63c06']
  };
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    // Carrega todos os dados em paralelo
    Promise.all([
      this.dashboardService.getGeneralStats().toPromise(),
      this.dashboardService.getPackagesByDestination().toPromise(),
      this.dashboardService.getUsersByStatus().toPromise()
    ]).then(([stats, packagesData, usersData]) => {
      this.generalStats = stats!;
      this.packagesByDestination = packagesData!;
      this.usersByStatus = usersData!;
      this.isLoading = false;
    });
  }

  // Formata os valores de moeda para os gráficos
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
}
