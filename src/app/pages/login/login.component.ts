import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputsComponent } from '../../components/primary-input/primary-input.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../types/login-request.type';

// Interface para o formulário
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
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private authService: AuthService,
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

    const credenciais: LoginRequest = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    };

    // ✅ CORREÇÃO AQUI: Chamando o método a partir do authService, e não do loginForm
    this.authService.login(credenciais).subscribe({
      next: (response) => {
        // A lógica de salvar o token e o usuário pode ser adicionada aqui
        this.toastService.success("Login efetuado com sucesso!");
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        console.error(err); // É bom logar o erro para depuração
        this.toastService.error("E-mail ou senha inválidos. Tente novamente.");
      }
    });
  }

  navigate() {
    this.router.navigate(["/signup"]);
  }

  navigateToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }
}