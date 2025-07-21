import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputsComponent } from '../../components/primary-input/primary-input.component';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// As importações de Header e Footer não estavam sendo usadas e foram removidas.

// Interface com tipagem mais específica para os controles do formulário
interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputsComponent,
  ],
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.toastService.error("Por favor, preencha os campos corretamente.");
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.loginService.login(email, password).subscribe({
      next: () => {
        this.toastService.success("Login efetuado com sucesso!");
        // ✅ AJUSTE PRINCIPAL: Altere "dashboard" para a rota da sua área de usuário
        this.router.navigate(["dashboard"]);
      },
      error: () => {
        this.toastService.error("E-mail ou senha inválidos. Tente novamente.");
      }
    });
  }

  navigate() {
    this.router.navigate(["signup"]);
  }

  navigateToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }
}