// src/app/pages/profile/profile.component.ts

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user.type';

// ✅ PASSO 1: Importe o CommonModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
 
  standalone: true, 
  
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.currentUser$;
  }
}