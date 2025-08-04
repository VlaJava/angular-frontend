import { Component } from '@angular/core';
import { PrimaryInputsComponent } from '../../components/primary-input/primary-input.component';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        PrimaryInputsComponent,
        DefaultLoginLayoutComponent,
        ReactiveFormsModule
    ],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  submit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.toastService.success('Se um e-mail correspondente for encontrado, um link de recuperação será enviado.', 'Verifique sua caixa de entrada!');
        
        this.router.navigateByUrl(this.router.parseUrl('/login')); 
      },
      error: () => {
        this.toastService.success('Se um e-mail correspondente for encontrado, um link de recuperação será enviado.', 'Verifique sua caixa de entrada!');
        
        this.router.navigateByUrl(this.router.parseUrl('/login'));
      }
    });
  }

  navigate() {
    
    this.router.navigateByUrl(this.router.parseUrl('/login'));
  }
}
