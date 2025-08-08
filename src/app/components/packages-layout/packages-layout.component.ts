import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core'; // Adicionado OnDestroy
import { FormsModule } from '@angular/forms';
import { PackageCardComponent } from '../package-card/package-card.component';
import { CommonModule } from '@angular/common';
import { Package } from '../../types/package.type';
import { PackageService, PaginatedPackagesResponse } from '../../services/package.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-packages-layout',
  standalone: true,
  imports: [
    CommonModule,
    PackageCardComponent,
    FormsModule, 
    RouterLink
  ],
  templateUrl: './packages-layout.component.html',
  styleUrls: ['./packages-layout.component.scss']
})
export class PackagesLayoutComponent implements OnInit, OnChanges, OnDestroy { // Implementado OnDestroy


  carouselSlides: any[] = [

     {
      imageUrl: '/assets/carrossel/coroo4.jpg', 
      
    },
    {
      imageUrl: '/assets/homepage/paris.jpg',
    
    },
    {
      imageUrl: '/assets/carrossel/Carro5.jpg', 
      
    },
    {
      imageUrl: '/assets/carrossel/carro3.webp', 
      
    },
    {
      imageUrl: '/assets/carrossel/carro6.jpg', 
      
    }
    
  ];
  currentSlideIndex: number = 0;
  private slideInterval: any;
  // --- Fim das Propriedades do Carrossel ---

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
    this.startCarousel(); // Inicia o carrossel automático
  }

  ngOnChanges() {
    // Lógica de OnChanges, se necessária
  }
  
  ngOnDestroy() {
    clearInterval(this.slideInterval); // Limpa o intervalo para evitar memory leaks
  }

  // --- Métodos do Carrossel ---
  startCarousel() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Muda de slide a cada 5 segundos
  }

  selectSlide(index: number) {
    this.currentSlideIndex = index;
    clearInterval(this.slideInterval);
    this.startCarousel();
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselSlides.length;
  }

  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.carouselSlides.length) % this.carouselSlides.length;
  }
  // --- Fim dos Métodos do Carrossel ---
  
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