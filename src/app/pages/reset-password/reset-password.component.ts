import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

// Importe os seus componentes de layout para que o Angular os reconheça
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { PrimaryInputsComponent } from '../../components/primary-input/primary-input.component';

// Interface para o formulário
interface ResetPasswordForm {
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
}

// Validador para verificar se as senhas coincidem
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('passwordConfirm')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DefaultLoginLayoutComponent,
        PrimaryInputsComponent
    ],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  // ✅ PROPRIEDADE DEFINIDA: O formulário agora existe no componente.
  resetPasswordForm: FormGroup<ResetPasswordForm>;
  token: string | null = null;

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
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.toastService.error('Token de redefinição de senha inválido ou ausente.');
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.toastService.warning('Por favor, preencha as senhas corretamente e certifique-se de que elas coincidem.');
      return;
    }

    if (!this.token) {
      this.toastService.error('Token de redefinição de senha ausente. Por favor, tente novamente.');
      return;
    }

    const newPassword = this.resetPasswordForm.value.password!;
    const confirmPassword = this.resetPasswordForm.value.passwordConfirm!;

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
