import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap, tap } from 'rxjs';
// [INÍCIO] Importações adicionadas
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// [FIM] Importações adicionadas

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user-service';
import { User } from '../../types/user.type';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  userImage: SafeUrl | null = null; // Propriedade para a URL segura da imagem
  profileForm: FormGroup;
  isEditing = false;
  selectedFile: File | null = null;
  // A propriedade 'apiUrl' não é usada, pode ser removida para limpar o código.
  // private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer // [ALTERAÇÃO] Injetar DomSanitizer
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      birthdate: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.profileForm.patchValue(user);
        this.loadProfileImage(user.id); // [ALTERAÇÃO] Chamar método para carregar a imagem
      } else {
        this.userImage = null; // Limpar imagem se não houver usuário
      }
    });
  }

  // [NOVO] Método para carregar a imagem de forma segura
  loadProfileImage(userId: string): void {
    // Assumindo que você adicionou o método 'getUserProfileImage' ao seu UserService
    this.userService.getUserProfileImage(userId).subscribe({
      next: (imageBlob) => {
        const objectUrl = URL.createObjectURL(imageBlob);
        this.userImage = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      },
      error: () => {
        // Opcional: Lidar com erro se a imagem não puder ser carregada
        console.error('Não foi possível carregar a imagem do perfil.');
        this.userImage = null; // Define como nulo ou uma imagem padrão
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.profileForm.patchValue(this.user);
    }
  }

  onProfileSubmit(): void {
    if (this.profileForm.invalid || !this.user) {
      this.toastr.error('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.userService.updateUser(this.user.id, this.profileForm.value).pipe(
      switchMap(updatedUser => this.authService.refreshUserProfile(updatedUser.id))
    ).subscribe({
      next: () => {
        this.toastr.success('Perfil atualizado com sucesso!');
        this.isEditing = false;
      },
      error: () => {
        this.toastr.error('Ocorreu um erro ao atualizar o perfil.');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadProfilePicture();
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile || !this.user) return;

    this.userService.uploadProfilePicture(this.user.id, this.selectedFile).pipe(
      // [ALTERAÇÃO] O refreshUserProfile já atualiza o 'currentUser$'.
      // A chamada ao 'loadProfileImage' dentro do 'ngOnInit' irá recarregar a imagem.
      // Opcionalmente, pode chamar aqui diretamente para uma resposta visual mais rápida.
      switchMap(() => this.authService.refreshUserProfile(this.user!.id))
    ).subscribe({
      next: () => {
        this.toastr.success('Foto de perfil atualizada!');
        // A imagem será atualizada automaticamente pela subscrição no ngOnInit.
      },
      error: () => {
        this.toastr.error('Falha ao enviar a foto.');
      }
    });
  }

  deactivateAccount(): void {
    if (!this.user || !confirm('Tem a certeza de que deseja excluir o seu perfil? Esta ação não pode ser desfeita.')) {
      return;
    }

    this.userService.toggleUserActiveStatus(this.user.id, false).subscribe({
      next: () => {
        this.toastr.info('A sua conta foi desativada. A fazer logout...');
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: () => {
        this.toastr.error('Ocorreu um erro ao desativar a sua conta.');
      }
    });
  }

  navigateToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }
}