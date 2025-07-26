import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageLayoutComponent } from '../../../components/packages-layout/packages-layout.component';
import { PackageService } from '../../../services/package.service';

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
    this.packageService.getPackages().subscribe({
      next: (data) => {
        // Agora os tipos são compatíveis e o erro desaparece
        this.pacotes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pacotes', err);
        this.isLoading = false;
      }
    });
  }
}
