import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { Package } from '../../types/package.type';

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {

  package: Package | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService
  ) { }

  ngOnInit(): void {
    
    const packageId = this.route.snapshot.paramMap.get('id');
    
    if (packageId) {
      this.isLoading = true;
      
      
      this.packageService.getPackageById(packageId).subscribe({
        next: (data) => {
          if (data) {
            this.package = data;
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