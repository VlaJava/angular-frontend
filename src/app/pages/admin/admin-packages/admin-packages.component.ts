import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Adicionado CurrencyPipe
import { PackageModalComponent } from '../../../components/package-modal/package-modal.component';
import { PackageService } from '../../../services/package.service';
import { ToastrService } from 'ngx-toastr';
import { Package } from '../../../types/package.type';

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

  constructor(
    private packageService: PackageService,
    private toastr: ToastrService
  ) {}


  
  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.isLoading = true;
    this.packageService.getPackages().subscribe({
      next: (data) => {
        this.packages = data;
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
