import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'; 
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
export class HeaderComponent implements OnInit, OnDestroy {
  
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  imageLoadError = false;

  
  private destroy$ = new Subject<void>();
  
  constructor(
    private authService: AuthService, 
    private router: Router 
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isAdmin$ = this.authService.isAdmin$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
   
    this.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      
      this.imageLoadError = false;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']); 
  }

  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}