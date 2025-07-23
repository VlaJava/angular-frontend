import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { Package } from '../../types/package.type';

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {

  pacote: Package | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      // ✅ CORREÇÃO: Converte o ID da URL (string) para um número
      const packageId = +idParam; 
      this.isLoading = true;
      
      this.packageService.getPackageById(packageId).subscribe({
        next: (data) => {
          if (data) {
            this.pacote = data;
          } else {
            this.router.navigate(['/']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar o pacote:', err);
          this.router.navigate(['/']);
          this.isLoading = false;
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
