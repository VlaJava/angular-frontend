import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageLayoutComponent } from '../../../components/packages-layout/packages-layout.component';
// ✅ 1. Importe a interface da resposta paginada juntamente com o serviço
import { PackageService, PaginatedPackagesResponse } from '../../../services/package.service';

import { Package } from '../../../types/package.type';

@Component({
  selector: 'app-default-home',
  standalone: true,
  imports: [
    CommonModule,
    PackageLayoutComponent
  ],
  templateUrl: './defaultHome.component.html',
  styleUrls: ['./defaultHome.component.scss']
})
export class DefaultHomeComponent implements OnInit {

  pacotes: Package[] = [];
  isLoading = true;

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.packageService.getPackages(0, 6).subscribe({
      next: (data: PaginatedPackagesResponse) => {
        this.pacotes = data.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pacotes', err);
        this.isLoading = false;
      }
    });
  }
}
