import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { Package } from '../../types/package.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-package-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './packages-admin.component.html',
  styleUrls: ['./packages-admin.component.scss']
})
export class PackageAdminComponent implements OnInit {

  package: Package | undefined;
  isLoading = true;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const packageId = this.route.snapshot.paramMap.get('id');
    if (packageId) {
      this.packageService.getPackageById(packageId).subscribe({
        next: (data) => {
          this.package = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar o pacote:', err);
          this.router.navigate(['/']);
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUploadImage(): void {
  if (this.package && this.selectedFile) {
    // A única mudança é aqui, no nome do método
    this.packageService.uploadPackageImage(this.package.id.toString(), this.selectedFile).subscribe({
      next: () => {
        this.toastr.success('Imagem atualizada com sucesso!');
        // Recarregar a página para mostrar a nova imagem é uma boa abordagem
        window.location.reload(); 
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar imagem.');
        console.error(err);
      }
    });
  }
}

  onEdit(): void {
    this.router.navigate([`/packages/${this.package?.id}/edit`]);
  }

  onDelete(): void {
    if (this.package) {
      this.packageService.deletePackage(this.package.id).subscribe({
        next: () => {
          this.toastr.success('Pacote excluído com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toastr.error('Erro ao excluir o pacote.');
          console.error(err);
        }
      });
    }
  }
}
