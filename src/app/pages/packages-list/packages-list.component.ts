import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Package } from '../../types/package.type';
import { PackageService, PaginatedPackagesResponse } from '../../services/package.service';
import { PackageListItemComponent } from '../../components/package-list-item/package-list-item.component';


@Component({
  selector: 'app-packages-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PackageListItemComponent
  ],
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.scss']
})
export class PackagesListComponent implements OnInit, OnDestroy {

  packages: Package[] = [];
  
  
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
  pageSize: number = 5;

  isLoading = true;
  
  
  private filterChange = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private packageService: PackageService) { }

  ngOnInit(): void {
    this.loadPackages();

    
    this.filterChange.pipe(
      debounceTime(500), 
      distinctUntilChanged(), 
      takeUntil(this.destroy$) 
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadPackages();
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  onFilterChange(): void {
    this.filterChange.next();
  }


  triggerSearchNow(): void {
    this.currentPage = 0;
    this.loadPackages();
  }

  onSearch() {
    this.currentPage = 0;
    this.loadPackages();
  }

  onBudgetChange() {
    this.currentPage = 0;
    this.loadPackages();
  }

  loadPackages(): void {
    this.isLoading = true;
    const filters = {
      source: this.filterOrigin,
      destination: this.filterDestination,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate,
      price: this.budgetValue < this.maxBudget ? this.budgetValue : null
    };

    this.packageService.getPackages(this.currentPage, this.pageSize, filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: PaginatedPackagesResponse) => {
        this.packages = response.content;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        this.isLoading = false;
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPackages();
    }
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
  
  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }
}
