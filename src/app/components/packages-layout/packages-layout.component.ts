import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PackageCardComponent } from '../package-card/package-card.component';
import { CommonModule } from '@angular/common';
import { Package } from '../../types/package.type';

@Component({
  selector: 'app-packages-layout',
  standalone: true,
  imports: [
    CommonModule,
    PackageCardComponent,
    FormsModule
  ],
  templateUrl: './packages-layout.component.html',
  styleUrl: './packages-layout.component.scss'
})
export class PackageLayoutComponent implements OnInit, OnChanges {

  @Input() pacotes: Package[] = [];
  

  filteredPackages: Package[] = [];
  

  filterOrigin: string = '';
  filterDestination: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';
  budgetValue: number = 15000;
  maxBudget: number = 15000;
  minBudget: number = 1000;

  constructor() { }

  ngOnInit() {
    this.filteredPackages = [...this.pacotes];
  }

  ngOnChanges() {
    this.filteredPackages = [...this.pacotes];
    this.applyFilters();
  }

  
  applyFilters() {
    if (!this.pacotes || this.pacotes.length === 0) {
      this.filteredPackages = [];
      return;
    }

    this.filteredPackages = this.pacotes.filter(pacote => {
    
      const budgetMatch = pacote.valor <= this.budgetValue;
      
      const destinationMatch = !this.filterDestination || 
        pacote.destino.toLowerCase().includes(this.filterDestination.toLowerCase()) ||
        pacote.localizacao.toLowerCase().includes(this.filterDestination.toLowerCase());
      
    
      const originMatch = !this.filterOrigin || 
        (pacote.origem && pacote.origem.toLowerCase().includes(this.filterOrigin.toLowerCase()));
      
      
      const startDateMatch = !this.filterStartDate || 
        !pacote.dataInicio || 
        new Date(pacote.dataInicio) >= new Date(this.filterStartDate);
      
      const endDateMatch = !this.filterEndDate || 
        !pacote.dataFinal || 
        new Date(pacote.dataFinal) <= new Date(this.filterEndDate);
      
      const matches = budgetMatch && destinationMatch && originMatch && startDateMatch && endDateMatch;
      
      return matches;
    });
    
  
    console.log('Filtros aplicados:', {
      totalPacotes: this.pacotes.length,
      budgetValue: this.budgetValue,
      filterDestination: this.filterDestination,
      filterOrigin: this.filterOrigin,
      filterStartDate: this.filterStartDate,
      filterEndDate: this.filterEndDate,
      resultados: this.filteredPackages.length
    });
  }

  onSearch() {
    this.applyFilters();
  }


  onBudgetChange() {
    this.applyFilters();
  }

  get formattedBudget(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(this.budgetValue);
  }

 
  get sectionTitle(): string {
    return this.hasActiveFilters() ? 'Pacotes Encontrados' : 'Pacotes Imperdíveis';
  }


  clearFilters() {
    this.filterOrigin = '';
    this.filterDestination = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.budgetValue = this.maxBudget;
    this.filteredPackages = [...this.pacotes];
  }

  hasActiveFilters(): boolean {
    return !!(this.filterDestination || 
             this.filterOrigin || 
             this.filterStartDate || 
             this.filterEndDate || 
             this.budgetValue < this.maxBudget);
  }

  removeFilter(filterType: string) {
    switch(filterType) {
      case 'destination':
        this.filterDestination = '';
        break;
      case 'origin':
        this.filterOrigin = '';
        break;
      case 'budget':
        this.budgetValue = this.maxBudget;
        break;
      case 'startDate':
        this.filterStartDate = '';
        break;
      case 'endDate':
        this.filterEndDate = '';
        break;
    }
    this.applyFilters();
  }

}