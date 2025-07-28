import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrimaryInputsComponent } from '../../components/primary-input/primary-input.component';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { AuthService } from '../../services/auth.service';
import { UserSignup } from '../../types/user-signup.type';

// Interface do formulário (sem alterações)
interface SignupForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  dateOfBirth: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
  documentType: FormControl<string | null>;
  documentNumber: FormControl<string | null>;
}


function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('passwordConfirm')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputsComponent
  ],

  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.signupForm = new FormGroup<SignupForm>({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(9)]),
      dateOfBirth: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
      documentType: new FormControl('', [Validators.required]),
      documentNumber: new FormControl('', [Validators.required])
    }, { validators: passwordMatchValidator });

    // >>>>> CORREÇÕES APLICADAS AQUI <<<<<
    this.signupForm.get('documentType')?.valueChanges.subscribe(type => {
      const control = this.signupForm.get('documentNumber');
      if (type === 'CPF') { // AGORA É 'CPF' EM MAIÚSCULAS
        control?.setValidators([Validators.required, Validators.pattern(/^\d{11}$/)]);
      } else if (type === 'PASSAPORTE') { // AGORA É 'PASSAPORTE' EM MAIÚSCULAS
        control?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]); // AGORA É EXATAMENTE 8 DÍGITOS
      } else {
        control?.setValidators([Validators.required]);
      }
      control?.updateValueAndValidity();
    });
  }

  submit() {
    if (this.signupForm.invalid) {
      Object.values(this.signupForm.controls).forEach(control => control.markAsTouched());
      this.toastService.warning('Preencha todos os campos corretamente!');
      return;
    }

    // Mapeando os nomes do formulário para os nomes esperados pelo backend
    const userData: UserSignup = {
      name: this.signupForm.value.name!,
      email: this.signupForm.value.email!,
      password: this.signupForm.value.password!,
      phone: this.signupForm.value.phone!,
      birthdate: this.signupForm.value.dateOfBirth!,
      documentType: this.signupForm.value.documentType!,
      documentNumber: this.signupForm.value.documentNumber!,
    };

    this.authService.signup(userData).subscribe({
      next: () => {
        this.toastService.success("Cadastro efetuado com sucesso! Verifique seu e-mail para confirmar a conta.");
        this.router.navigate(['/login']); // Redireciona para o login após o sucesso
      },
      error: (err) => {
        // Pega a mensagem de erro específica do backend, se houver
        const errorMessage = err.error?.message || "Ops! Erro inesperado! Tente novamente.";
        this.toastService.error(errorMessage);
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
