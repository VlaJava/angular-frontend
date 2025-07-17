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
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { PrimaryInputsComponent } from '../../components/primary-input/primary-input.component';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';


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

// Validador para verificar se senha e confirmação coincidem
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
  providers: [LoginService],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'] // <- Corrigido aqui
})
export class SignupComponent {
  signupForm: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
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

    // Validação dinâmica para o número do documento
    this.signupForm.get('documentType')?.valueChanges.subscribe(type => {
      const control = this.signupForm.get('documentNumber');
      if (type === 'cpf') {
        control?.setValidators([Validators.required, Validators.pattern(/^\d{11}$/)]);
      } else if (type === 'passaport') {
        control?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(9)]);
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

    const {
      name,
      email,
      phone,
      dateOfBirth,
      password,
      documentType,
      documentNumber
    } = this.signupForm.value;

    this.loginService.signup(
      name!,
      email!,
      password!,
      dateOfBirth!,
      phone!,
      documentType!,
      documentNumber!
    ).subscribe({
      next: () => {
        this.toastService.success("Cadastro efetuado com sucesso!");
        this.navigate();
      },
      error: () => {
        this.toastService.error("Opss! Erro inesperado! Tente novamente.");
      }
    });
  }

  navigate() {
    this.router.navigate(['login']);
  }
}
