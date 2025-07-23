import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { PrimaryInputsComponent } from '../../../components/primary-input/primary-input.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimaryInputsComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  
  profileForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl({ value: '', disabled: true }),
    documentType: new FormControl('cpf', [Validators.required]),
    documentNumber: new FormControl('', [Validators.required])
  });

  isEditing = false;
  profileImageUrl: string = 'https://img.freepik.com/vetores-premium/ilustracao-plana-vetorial-em-escala-de-cinza-avatar-perfil-de-usuario-icone-de-pessoa-imagem-de-perfil-de-silhueta-neutra-de-genero-adequado-para-perfis-de-midia-social-icones-protetores-de-tela-e-como-um-modelo-x9xa_719432-875.jpg?semt=ais_hybrid&w=740';
  private selectedFile: File | null = null;

  constructor(
    private router: Router,
    private toastService: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const mockUserData = {
      name: 'Breno Odlanireb Celerino da Silva Filho',
      phone: '(81) 98809-6849',
      dateOfBirth: '2004-09-01',
      email: 'breno@gmail.com',
      documentType: 'cpf',
      documentNumber: '123.456.789-12',
      profileImageUrl: null
    };
    
    this.profileImageUrl = mockUserData.profileImageUrl || 'https://img.freepik.com/vetores-premium/ilustracao-plana-vetorial-em-escala-de-cinza-avatar-perfil-de-usuario-icone-de-pessoa-imagem-de-perfil-de-silhueta-neutra-de-genero-adequado-para-perfis-de-midia-social-icones-protetores-de-tela-e-como-um-modelo-x9xa_719432-875.jpg?semt=ais_hybrid&w=740';
    this.profileForm.patchValue(mockUserData);
    this.profileForm.disable();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
      this.profileForm.controls['email'].disable();
    } else {
      this.profileForm.disable();
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      console.log('Salvando dados:', this.profileForm.getRawValue());
      if (this.selectedFile) {
        console.log('Enviando novo arquivo de imagem:', this.selectedFile.name);
      }
      this.toastService.success('Perfil atualizado com sucesso!');
      this.toggleEdit();
    }
  }

  deleteProfile(): void {
    if(confirm('Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita.')) {
      this.toastService.warning('Perfil excluído com sucesso.');
      this.router.navigate(['/login']);
    }
  }

  changePassword(): void {
    this.router.navigate(['/change-password']);
  }
}