import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageModalComponent } from '../../../components/package-modal/package-modal.component';
import { PackageService } from '../../../services/package.service';
import { ToastrService } from 'ngx-toastr';
import { Package } from '../../../types/package.type';

@Component({
  selector: 'app-admin-packages',
  standalone: true,
  imports: [
    CommonModule,
    PackageModalComponent
  ],
  templateUrl: './admin-packages.component.html',
  styleUrls: ['./admin-packages.component.scss']
})
export class AdminPackagesComponent implements OnInit {
  isModalVisible = false;
  isLoading = true; 
  packages: Package[] = [];

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

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

 handleSavePackage(packageData: Omit<Package, 'id'>) {
    
    this.packageService.createPackage(packageData).subscribe({
      next: () => {
        this.toastr.success('Pacote salvo com sucesso!');
        this.loadPackages();
        this.closeModal();
      },
      error: () => {
        this.toastr.error('Erro ao salvar o pacote.');
      }
    });
  }

  
  handleDeletePackage(packageId: string): void {
    
    if (confirm('Tem certeza que deseja excluir este pacote?')) {
      this.packageService.deletePackage(packageId).subscribe({
        next: () => {
          this.toastr.success('Pacote excluído com sucesso!');
          this.loadPackages();
        },
        error: () => {
          this.toastr.error('Erro ao excluir o pacote.');
        }
      });
    }
  }
}
