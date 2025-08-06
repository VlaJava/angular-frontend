// header.component.ts

import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router'; 
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, filter, switchMap, map, catchError } from 'rxjs/operators'; 
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Importações adicionadas

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user-service'; // Importação adicionada
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

  currentUser$: Observable<User | null>;
  userImage$: Observable<SafeUrl | null>; 
  
  isScrolled = false;
  isHomePage = false; 
  isNavOpen = false; 

 

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService, 
    private sanitizer: DomSanitizer, 
    private router: Router 
  ) {
    this.currentUser$ = this.authService.currentUser$;
    
    
    this.userImage$ = this.currentUser$.pipe(
      switchMap(user => {
        if (user && user.id) {
          
          return this.userService.getUserProfileImage(user.id).pipe(
            map(imageBlob => {
              const objectUrl = URL.createObjectURL(imageBlob);
              return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
            }),
            catchError(() => {
              
              return of(null); 
            })
          );
        }
       
        return of(null); 
      })
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = event.urlAfterRedirects === '/';
    });

  }

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
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