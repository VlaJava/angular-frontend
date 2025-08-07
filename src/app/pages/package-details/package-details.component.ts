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
  numberOfDays: number | null = null;

  // Array com dados de exemplo para as avaliações
  mockReviews = [
    {
      name: 'Ana Pereira',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      comment: 'Viagem incrível! A organização foi impecável e o destino é ainda mais bonito pessoalmente. Recomendo muito!',
      date: '20 de Julho, 2025'
    },
    {
      name: 'Carlos Silva',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 4,
      comment: 'Gostei bastante do pacote. O hotel era ótimo e os guias muito atenciosos. Só achei o roteiro um pouco corrido no último dia.',
      date: '15 de Julho, 2025'
    },
    {
      name: 'Mariana Costa',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      comment: 'Experiência única! Superou todas as minhas expectativas. Com certeza viajarei com a agência novamente.',
      date: '02 de Julho, 2025'
    }
  ];

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

  // Método auxiliar para criar um array para o loop das estrelas
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
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