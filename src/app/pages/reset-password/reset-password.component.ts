import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrimaryInputsComponent } from '../../components/primary-input/primary-input.component';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


interface ResetPasswordForm {
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
}


function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('passwordConfirm')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputsComponent,
    CommonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup<ResetPasswordForm>;
  token: string | null = null; // Para armazenar o token da URL

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.resetPasswordForm = new FormGroup<ResetPasswordForm>({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    // Captura o token da URL quando o componente é inicializado
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.toastService.error('Token de redefinição de senha inválido ou ausente.');
        this.router.navigate(['/login']); // Redireciona para o login se não houver token
      }
    });
  }

  submit(): void {
    if (this.resetPasswordForm.invalid) {
      Object.values(this.resetPasswordForm.controls).forEach(control => control.markAsTouched());
      this.toastService.warning('Por favor, preencha as senhas corretamente e certifique-se de que elas coincidem.');
      return;
    }

    if (!this.token) {
      this.toastService.error('Token de redefinição de senha ausente. Por favor, tente novamente.');
      return;
    }

    const newPassword = this.resetPasswordForm.value.password!;
    const confirmPassword = this.resetPasswordForm.value.passwordConfirm!;

    // Chama o serviço de autenticação para redefinir a senha
    this.authService.resetPassword(this.token, newPassword, confirmPassword).subscribe({
      next: () => {
        this.toastService.success('Sua senha foi redefinida com sucesso! Faça login com sua nova senha.');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Erro ao redefinir a senha. O token pode ter expirado ou ser inválido.';
        this.toastService.error(errorMessage);
      }
    });
  }

  
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
