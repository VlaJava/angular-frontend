import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputsComponent } from '../../components/primary-input/primary-input.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../types/login-request.type';

// Interface para o formulário (opcional, mas boa prática)
// ✅ CORREÇÃO: Alterado de 'password' para 'senha'
interface LoginForm {
  email: FormControl<string | null>;
  senha: FormControl<string | null>;
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
      // ✅ CORREÇÃO: O nome do controlo agora é 'senha' para corresponder ao HTML
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.toastService.error("Por favor, preencha os campos corretamente.");
      return;
    }

    // ✅ CORREÇÃO: O this.loginForm.value agora já tem o formato correto { email: '...', senha: '...' }
    const credenciais: LoginRequest = {
      email: this.loginForm.value.email ?? '',
      senha: this.loginForm.value.senha ?? ''
    };

    this.authService.login(credenciais).subscribe({
      next: (user) => {
        this.toastService.success(`Login efetuado com sucesso, ${user.name}!`);
        // Redireciona para a página principal após o login
        this.router.navigate(["/"]); 
      },
      error: (err) => {
        console.error("Falha no login:", err); 
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
