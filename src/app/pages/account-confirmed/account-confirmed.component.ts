import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-account-confirmed',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './account-confirmed.component.html',
    styleUrl: './account-confirmed.component.scss'
})
export class AccountConfirmedComponent implements OnInit {
  confirmationStatus: 'pending' | 'success' | 'error' = 'pending';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.confirmAccount(token).subscribe({
        next: () => {
          this.confirmationStatus = 'success';
        },
        error: () => {
          this.confirmationStatus = 'error';
        }
      });
    } else {
      this.confirmationStatus = 'error';
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
