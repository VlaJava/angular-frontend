import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// Tipos de dados mockados para simular a estrutura
interface MockPackage {
  id: string;
  title: string;
}

interface MockAdminReview {
  id: string;
  packageId: string; // Para saber a qual pacote a avaliação pertence
  userName: string;
  rating: number;
  comment: string;
  reviewDate: string;
  removed: boolean;
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.scss']
})
export class AdminReviewsComponent implements OnInit {
  packages: MockPackage[] = [];
  allReviews: MockAdminReview[] = []; // Armazena todas as avaliações mockadas
  selectedPackageId: string | null = null;
  reviews: MockAdminReview[] = [];
  isLoadingPackages = true;
  isLoadingReviews = false;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    this.isLoadingPackages = true;
    // Simula um pequeno atraso, como se fosse uma chamada de API
    setTimeout(() => {
      this.packages = this._generateMockPackages();
      this.allReviews = this._generateMockReviews();
      this.isLoadingPackages = false;
    }, 500);
  }

  onPackageSelect(): void {
    if (!this.selectedPackageId) {
      this.reviews = [];
      return;
    }
    this.isLoadingReviews = true;
    // Simula um pequeno atraso
    setTimeout(() => {
      // Filtra as avaliações para mostrar apenas as do pacote selecionado
      this.reviews = this.allReviews.filter(r => r.packageId === this.selectedPackageId);
      this.isLoadingReviews = false;
    }, 300);
  }

  toggleReviewStatus(review: MockAdminReview): void {
    // Apenas altera o status no array local
    review.removed = !review.removed;
    const action = review.removed ? 'desativada' : 'ativada';
    this.toastr.success(`Avaliação ${action} com sucesso!`);
  }

  // --- Métodos de Geração de Dados de Exemplo ---

  private _generateMockPackages(): MockPackage[] {
    return [
      { id: 'pkg-1', title: 'Neve em Bariloche' },
      { id: 'pkg-2', title: 'Praias do Caribe' },
      { id: 'pkg-3', title: 'Aventura na Amazônia' }
    ];
  }

  private _generateMockReviews(): MockAdminReview[] {
    return [
      { id: 'rev-1', packageId: 'pkg-1', userName: 'Ana Pereira', rating: 5, comment: 'Viagem incrível! A organização foi impecável.', reviewDate: '2025-07-20', removed: false },
      { id: 'rev-2', packageId: 'pkg-1', userName: 'Carlos Silva', rating: 2, comment: 'Não gostei do hotel, muito barulhento. Não recomendo.', reviewDate: '2025-07-15', removed: true },
      { id: 'rev-3', packageId: 'pkg-2', userName: 'Mariana Costa', rating: 4, comment: 'O mar é maravilhoso, mas a comida do resort poderia ser melhor.', reviewDate: '2025-06-10', removed: false },
      { id: 'rev-4', packageId: 'pkg-2', userName: 'João Martins', rating: 5, comment: 'Paraíso na Terra! Voltarei com certeza!', reviewDate: '2025-06-05', removed: false },
      { id: 'rev-5', packageId: 'pkg-3', userName: 'Lucas Alves', rating: 3, comment: 'A experiência na selva é única, mas prepare-se para os mosquitos.', reviewDate: '2025-05-30', removed: false }
    ];
  }
}