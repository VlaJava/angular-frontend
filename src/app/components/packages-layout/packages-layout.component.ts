import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PackageCardComponent } from '../package-card/package-card.component';
import { CommonModule } from '@angular/common';
import { Package } from '../../types/package.type';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-packages-layout',
  standalone: true,
  imports: [
    CommonModule,
    PackageCardComponent,
    FormsModule
  ],
  templateUrl: './packages-layout.component.html',
  styleUrls: ['./packages-layout.component.scss']
})
export class PackageLayoutComponent implements OnInit, OnChanges {

  @Input() package: Package[] = [];
  

  filteredPackages: Package[] = [];
  

  filterOrigin: string = '';
  filterDestination: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';
  budgetValue: number = 15000;
  maxBudget: number = 15000;
  minBudget: number = 1000;

  constructor(
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.filteredPackages = [...this.package];
  }

  ngOnChanges() {
    this.filteredPackages = [...this.package];
    this.applyFilters();
  }

  
  applyFilters() {
    if (!this.package || this.package.length === 0) {
      this.filteredPackages = [];
      return;
    }

    this.filteredPackages = this.package.filter(pkg => {
    
      const budgetMatch = pkg.price <= this.budgetValue;
      
      const destinationMatch = !this.filterDestination || 
        pkg.destination.toLowerCase().includes(this.filterDestination.toLowerCase());
      
    
      const originMatch = !this.filterOrigin || 
        (pkg.source && pkg.source.toLowerCase().includes(this.filterOrigin.toLowerCase()));
      
      
      const startDateMatch = !this.filterStartDate || 
        !pkg.startDate || 
        new Date(pkg.startDate) >= new Date(this.filterStartDate);
      
      const endDateMatch = !this.filterEndDate || 
        !pkg.endDate || 
        new Date(pkg.endDate) <= new Date(this.filterEndDate);
      
      const matches = budgetMatch && destinationMatch && originMatch && startDateMatch && endDateMatch;
      
      return matches;
    });
    
  
    console.log('Filtros aplicados:', {
      totalpackages: this.package.length,
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

  get todayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
    this.filteredPackages = [...this.package];
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
