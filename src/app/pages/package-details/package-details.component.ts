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
  numberOfDays: number | null = null; // <-- Propriedade adicionada

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
            
            this.numberOfDays = this.calculateNumberOfDays(data.startDate, data.endDate);
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

  
  private calculateNumberOfDays(startDateString: string, endDateString: string): number | null {
    if (!startDateString || !endDateString) {
      return null;
    }

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const differenceInMs = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    
    return Math.round(differenceInDays) + 1;
  }
}