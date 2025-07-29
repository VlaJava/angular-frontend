import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // 1. Importar o Router
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgbDropdownModule,
    NgIf,
    AsyncPipe,
    RouterModule 
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  // 2. Injetar o Router no construtor
  constructor(
    private authService: AuthService, 
    private router: Router 
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isAdmin$ = this.authService.isAdmin$;
    this.currentUser$ = this.authService.currentUser$;
  }

onLogout(): void {
  this.authService.logout();
 
  this.router.navigate(['/']); 
}
}