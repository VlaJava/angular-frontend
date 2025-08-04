import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
 
import { User } from '../../../types/user.type';
import { UserService } from '../../../services/user-service';
import { ToastrService } from 'ngx-toastr';


export type UserRole = {
  id: string;
  userRole: 'CLIENT' | 'ADMIN';
};
 
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
};
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};
 
@Component({
  selector: 'app-admin-users',
  standalone: true,

  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit, OnDestroy {

  private originalUserRole: 'CLIENT' | 'ADMIN' | null = null;
  private destroy$ = new Subject<void>();
 
  filteredUsers: PaginatedResponse<UserResponse> = {
    content: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };
  
  
  searchForm!: FormGroup;
  showAddEditForm: boolean = false;
  currentUser: User | null = null;
  isLoading = true;
 
  constructor(
    private userService: UserService, 
    private toastr: ToastrService,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {
   
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.loadUsers(); 
    
    this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(400), 
      distinctUntilChanged(), 
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadUsers(); 
    });
  }
 
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  loadUsers(page: number = 0): void {
    this.isLoading = true;
   
    const searchTerm = this.searchForm.get('search')?.value || '';
    
    this.userService.getUsers(searchTerm, page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.filteredUsers = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error('Erro ao carregar usuários.');
        }
      });
  }

  
 
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

  addUser(): void {
    this.currentUser = {
      id: '', name: '', email: '', document: '', phone: '',
      active: true, role: 'CLIENT'
    };
    this.showAddEditForm = true;
  }
 
  editUser(user: UserResponse): void {
    this.originalUserRole = user.role.userRole;
    this.currentUser = {
      id: user.id, name: user.name, email: user.email,
      phone: user.phone, active: user.active,
      role: user.role.userRole,
      document: ''
    };
    this.showAddEditForm = true;
  }
 
  saveUser(): void {
    if (!this.currentUser) return;

    if (!this.currentUser.id) {
      const { id, active, ...newUserPayload } = this.currentUser;
      this.userService.createUser(newUserPayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastr.success('Usuário criado com sucesso!');
            this.loadUsers(); 
            this.cancelEdit();
          },
          error: (err) => this.toastr.error('Erro ao criar usuário.')
        });
      return;
    }

    const userToUpdate = this.currentUser;
    const newRole = (userToUpdate.role as any).userRole || userToUpdate.role;
    const isPromotion = this.originalUserRole === 'CLIENT' && newRole === 'ADMIN';

    if (isPromotion) {
      this.userService.updateUserRole(userToUpdate.email, 'ADMIN')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastr.success(`Perfil de Admin criado para ${userToUpdate.name}!`);
            this.loadUsers();
            this.cancelEdit();
          },
          error: (err) => this.toastr.error('Erro ao promover usuário para Admin.')
        });
    } else {
      this.userService.updateUser(userToUpdate.id, userToUpdate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastr.success('Usuário atualizado com sucesso!');
            this.loadUsers(this.filteredUsers.currentPage); 
            this.cancelEdit();
          },
          error: (err) => this.toastr.error('Erro ao atualizar usuário.')
        });
    }
  }
 
  cancelEdit(): void {
    this.showAddEditForm = false;
    this.currentUser = null;
    this.originalUserRole = null; 
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
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastr.success('Usuário excluído com sucesso.');
            this.loadUsers(this.filteredUsers.currentPage);
          },
          error: (error) => this.toastr.error('Erro ao excluir usuário.')
        });
    }
  }
}
