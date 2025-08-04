import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { PackageModalComponent } from '../../../components/package-modal/package-modal.component';
import { PackageService, PaginatedPackagesResponse } from '../../../services/package.service';
import { ToastrService } from 'ngx-toastr';
import { Package } from '../../../types/package.type';

@Component({
    selector: 'app-admin-packages',
    imports: [
        CommonModule,
        PackageModalComponent,
        CurrencyPipe,
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './admin-packages.component.html',
    styleUrls: ['./admin-packages.component.scss']
})
export class AdminPackagesComponent implements OnInit, OnDestroy {
  isModalOpen = false; 
  isLoading = true; 
  
  
  searchForm!: FormGroup; 
  private destroy$ = new Subject<void>();
  selectedPackageForEdit: Package | null = null;

  paginatedResponse: PaginatedPackagesResponse = {
    content: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };
    
  constructor(
    private packageService: PackageService,
    private toastr: ToastrService,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {
    
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.loadPackages(); 
    
    this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(400), 
      distinctUntilChanged(), 
      takeUntil(this.destroy$) 
    ).subscribe(() => {
      this.loadPackages(0); 
    });
  }

  loadPackages(page: number = 0): void {
    this.isLoading = true;
    
    const searchTerm = this.searchForm.get('search')?.value || '';

    
    this.packageService.getPackages(page, 6, searchTerm).subscribe({
      next: (data) => {
        this.paginatedResponse = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar os pacotes.');
        this.isLoading = false;
      }
    });
  }

  
  changePage(page: number): void {
    if (page >= 0 && page < this.paginatedResponse.totalPages) {
      this.loadPackages(page); 
    }
  }

  getPageNumbers(): number[] {
    if (!this.paginatedResponse || this.paginatedResponse.totalPages === 0) {
      return [];
    }
    return Array(this.paginatedResponse.totalPages).fill(0).map((x, i) => i);
  }
  
  openAddModal(): void {
    this.selectedPackageForEdit = null; 
    this.isModalOpen = true;
  }
  
  handleModalClose(wasSaved: boolean): void {
    this.isModalOpen = false;
    this.selectedPackageForEdit = null; 
    if (wasSaved) {
      this.loadPackages(this.paginatedResponse.currentPage);
    }
  }
 
  handleDeletePackage(packageId: string): void {
    if (confirm('Tem a certeza de que deseja apagar este pacote?')) {
      this.packageService.deletePackage(packageId).subscribe({
        next: () => {
          this.toastr.success('Pacote apagado com sucesso!');
          this.loadPackages(this.paginatedResponse.currentPage);
        },
        error: () => {
          this.toastr.error('Erro ao apagar o pacote.');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
