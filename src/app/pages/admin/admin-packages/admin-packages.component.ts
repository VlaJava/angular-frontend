import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Adicionado CurrencyPipe
import { PackageModalComponent } from '../../../components/package-modal/package-modal.component';
import { PackageService, PaginatedPackagesResponse } from '../../../services/package.service';
import { ToastrService } from 'ngx-toastr';
import { Package } from '../../../types/package.type';
import { PaginatedResponse, UserResponse } from '../admin-users/admin-users.component';


@Component({
  selector: 'app-admin-packages',
  standalone: true,
  imports: [
    CommonModule,
    PackageModalComponent,
    CurrencyPipe 
  ],
  templateUrl: './admin-packages.component.html',
  styleUrls: ['./admin-packages.component.scss']
})
export class AdminPackagesComponent implements OnInit {
  isModalOpen = false; 
  isLoading = true; 
  packages: Package[] = [];
  
  
  selectedPackageForEdit: Package | null = null;

  
   paginatedResponse: PaginatedPackagesResponse = {
    content: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };
    
  constructor(
    private packageService: PackageService,
    private toastr: ToastrService
  ) {}

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
  
  ngOnInit(): void {
    this.loadPackages();
  }

   loadPackages(page: number = 0): void {
    this.isLoading = true;
    this.packageService.getPackages(page).subscribe({
      next: (data) => {
        this.paginatedResponse = data; // Guarda a resposta de paginação completa
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar os pacotes.');
        this.isLoading = false;
      }
    });
  }

  
  openAddModal(): void {
    this.selectedPackageForEdit = null; 
    this.isModalOpen = true;
  }

  
  openEditModal(pkg: Package): void {
    this.selectedPackageForEdit = pkg; 
    this.isModalOpen = true;
  }

  
  handleModalClose(wasSaved: boolean): void {
    this.isModalOpen = false;
    this.selectedPackageForEdit = null; 
    if (wasSaved) {
      
      this.loadPackages();
    }
  }
 
  handleDeletePackage(packageId: string): void {
    if (confirm('Tem a certeza de que deseja apagar este pacote?')) {
      this.packageService.deletePackage(packageId).subscribe({
        next: () => {
          this.toastr.success('Pacote apagado com sucesso!');
          this.loadPackages();
        },
        error: () => {
          this.toastr.error('Erro ao apagar o pacote.');
        }
      });
    }
  }
}
