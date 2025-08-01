import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
 
import { User } from '../../../types/user.type';
import { UserService } from '../../../services/user-service';
import { ToastrService } from 'ngx-toastr';
 
export type UserRole = {
  id: string;
  userRole: 'CLIENT' | 'ADMIN';
}
 
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
}
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit, OnDestroy {
 
  private destroy$ = new Subject<void>();
 
  users: UserResponse[] = [];
  filteredUsers: PaginatedResponse<UserResponse> = {
    content: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };
  
  searchTerm: string = '';
  showAddEditForm: boolean = false;
  currentUser: User | null = null;
  isLoading = true;
 
  constructor(
    private userService: UserService, 
    private toastr: ToastrService
  ) {}


  changePage(page: number): void {
    if (page >= 0 && page < this.filteredUsers.totalPages) {
      this.loadUsers(page); 
    }
  }

  getPageNumbers(): number[] {
    if (!this.filteredUsers || this.filteredUsers.totalPages === 0) {
      return [];
    }
    return Array(this.filteredUsers.totalPages).fill(0).map((x, i) => i);
  }
 
  ngOnInit(): void {
    this.loadUsers();
  }
 
  ngOnDestroy(): void {
    
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  loadUsers(page: number = 0): void {
    this.isLoading = true;
    
    this.userService.getUsers(this.searchTerm, page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.filteredUsers = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error('Erro ao carregar usuários.');
          console.error('Erro ao carregar usuários:', error);
        }
      });
  }
 
  onSearch(): void {
    this.loadUsers();
  }
 
  addUser(): void {
    this.currentUser = {
      id: '', 
      name: '',
      email: '',
      document: '',
      phone: '',
      active: true,
      role: 'CLIENT'
    };
    this.showAddEditForm = true;
  }
 
  editUser(user: any): void {
    
    this.currentUser = { ...user };
    this.showAddEditForm = true;
  }
 
  saveUser(): void {
    if (!this.currentUser) return;
 
    
    if (this.currentUser.id) {
      this.userService.updateUser(this.currentUser.id, this.currentUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            
            this.loadUsers(); 
            this.cancelEdit();
          },
          error: (err) => console.error('Erro ao atualizar usuário:', err)
        });
    } else {
      
      const { id, active, ...newUserPayload } = this.currentUser;
      this.userService.createUser(newUserPayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            
            this.loadUsers(); 
            this.cancelEdit();
          },
          error: (err) => console.error('Erro ao adicionar usuário:', err)
        });
    }
  }
 
  cancelEdit(): void {
    this.showAddEditForm = false;
    this.currentUser = null;
  }
 
  toggleActive(user: UserResponse): void {
    const newStatus = !user.active;
    this.userService.toggleUserActiveStatus(user.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          
          const index = this.filteredUsers.content.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.filteredUsers.content[index].active = updatedUser.active;
          }
        },
        error: (err) => console.error('Erro ao alterar status do usuário:', err)
      });
  }
 
  deleteUser(id: string): void {
    this.userService.deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Usuário excluído com sucesso.');
          this.filteredUsers.content = this.filteredUsers.content.filter(user => user.id !== id);
        },
        error: (error: any) => {
          console.error('Erro ao excluir usuário:', error);
        }
      });
  }
}