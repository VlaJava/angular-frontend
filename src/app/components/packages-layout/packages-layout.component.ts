import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PackageCardComponent } from '../package-card/package-card.component';
import { CommonModule } from '@angular/common';
import { Package } from '../../types/package.type';
import { PackageService, PaginatedPackagesResponse } from '../../services/package.service';

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
export class PackagesLayoutComponent implements OnInit, OnChanges {

  @Input() package: Package[] = [];
  
  filteredPackages: Package[] = [];

  
  filterOrigin: string = '';
  filterDestination: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';
  budgetValue: number = 15000;
  maxBudget: number = 15000;
  minBudget: number = 1000;

 
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  pageSize: number = 6; 

  constructor(
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.loadPackages();
  }

  ngOnChanges() {
   
  }
  
  
  loadPackages() {
    const filters = {
      source: this.filterOrigin,
      destination: this.filterDestination,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate,
      price: this.budgetValue
    };

    this.packageService.getPackages(this.currentPage, this.pageSize, filters)
      .subscribe((response: PaginatedPackagesResponse) => {
        this.package = response.content;
        this.filteredPackages = response.content;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
      });
  }

  
  onSearch() {
    this.currentPage = 0;
    this.loadPackages();
  }

  onBudgetChange() {
    this.currentPage = 0;
    this.loadPackages();
  }

  
  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPackages();
    }
  }

  clearFilters() {
    this.filterOrigin = '';
    this.filterDestination = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.budgetValue = this.maxBudget;
    this.currentPage = 0;
    this.loadPackages();
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
    this.onSearch(); 
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

  
  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }
}