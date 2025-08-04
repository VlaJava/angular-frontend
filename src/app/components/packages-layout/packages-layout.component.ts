import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageCardComponent } from '../package-card/package-card.component'; // Verifique o caminho
import { Package } from '../../types/package.type';
import { PackageService, PaginatedPackagesResponse } from '../../services/package.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-packages-layout',
    standalone: true,
    imports: [
        CommonModule,
        PackageCardComponent
    ],
    templateUrl: './packages-layout.component.html',
    styleUrls: ['./packages-layout.component.scss']
})
export class PackagesLayoutComponent implements OnInit { 


  paginatedResponse: PaginatedPackagesResponse = {
    content: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };
  isLoading = true;

  constructor(
    private packageService: PackageService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(page: number = 0): void {
    this.isLoading = true;
    this.packageService.getPackages(page, 6).subscribe({ // Busca 6 pacotes por página
      next: (data) => {
        this.paginatedResponse = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar os pacotes.');
        console.error(err);
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
}
