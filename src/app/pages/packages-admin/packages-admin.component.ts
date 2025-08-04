import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { Package } from '../../types/package.type';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-package-admin',
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './packages-admin.component.html',
    styleUrls: ['./packages-admin.component.scss']
})
export class PackageAdminComponent implements OnInit {

  imagePreview: string | ArrayBuffer | null = null;
  package: Package | undefined;
  isLoading = true;
  selectedFile: File | null = null;
  isEditing = false; 
  packageForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private toastr: ToastrService,
    private fb: FormBuilder
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

  enterEditMode(): void {
    if (!this.package) return;
    this.packageForm = this.fb.group({
      title: [this.package.title, Validators.required],
      source: [this.package.source, Validators.required],
      destination: [this.package.destination, Validators.required],
      description: [this.package.description, Validators.required],
      price: [this.package.price, [Validators.required, Validators.min(1)]],
      travelerLimit: [this.package.travelerLimit, [Validators.required, Validators.min(1)]],
      startDate: [new Date(this.package.startDate).toISOString().split('T')[0], Validators.required],
      endDate: [new Date(this.package.endDate).toISOString().split('T')[0], Validators.required],
      available: [this.package.available]
    });
    this.isEditing = true;
  }

  cancelEditMode(): void {
    this.isEditing = false;
  }

  // MÉTODO onSave ADICIONADO
  onSave(): void {
    if (!this.packageForm.valid || !this.package) {
      this.toastr.error('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.packageService.updatePackage(this.package.id.toString(), this.packageForm.value).subscribe({
      next: (updatedPackage) => {
        this.package = updatedPackage; // Atualiza os dados da página com a resposta
        this.isEditing = false; // Sai do modo de edição
        this.toastr.success('Pacote atualizado com sucesso!');
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar o pacote.');
        console.error(err);
      }
    });
  }

  // --- MÉTODOS PARA UPLOAD E EXCLUSÃO ---

 onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.selectedFile = file;

    // Lógica para criar e exibir o preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

  onUploadImage(): void {
    if (this.package && this.selectedFile) {
      this.packageService.uploadPackageImage(this.package.id.toString(), this.selectedFile).subscribe({
        next: () => {
          this.toastr.success('Imagem atualizada com sucesso!');
          window.location.reload(); 
        },
        error: (err) => {
          this.toastr.error('Erro ao atualizar imagem.');
          console.error(err);
        }
      });
    }
  }

  onDelete(): void {
    if (confirm('Tem certeza que deseja excluir este pacote? A ação não pode ser desfeita.')) {
      if (this.package) {
        this.packageService.deletePackage(this.package.id).subscribe({
          next: () => {
            this.toastr.success('Pacote excluído com sucesso!');
            this.router.navigate(['/admin/packages']); 
          },
          error: (err) => {
            this.toastr.error('Erro ao excluir o pacote.');
            console.error(err);
          }
        });
      }
    }
  }
  
  
}