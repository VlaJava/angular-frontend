// src/app/pages/admin/admin-users/admin-users.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../../types/user.type';
import { UserService } from '../../../services/user-service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  // Subject para gerenciar a desinscrição de observables
  private destroy$ = new Subject<void>();

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  showAddEditForm: boolean = false;
  currentUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    // Emite um valor para completar todos os observables inscritos
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.userService.getUsers(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: User[]) => {
          this.users = data;
          this.filteredUsers = data;
        },
        error: (error: any) => {
          console.error('Erro ao carregar usuários:', error);
          // TODO: Implementar feedback visual para o usuário (ex: ToastrService)
        }
      });
  }

  onSearch(): void {
    this.loadUsers();
  }

  addUser(): void {
    this.currentUser = {
      id: '', // ✅ Correto: string vazia para novo usuário
      name: '',
      email: '',
      document: '',
      phone: '',
      active: true,
      role: 'CLIENT'
    };
    this.showAddEditForm = true;
  }

  editUser(user: User): void {
    // Clona o objeto para evitar edições diretas na tabela antes de salvar
    this.currentUser = { ...user };
    this.showAddEditForm = true;
  }

  saveUser(): void {
    if (!this.currentUser) return;

    // Distingue entre criar (ID é 0) e atualizar (ID existe)
    if (this.currentUser.id) {
      this.userService.updateUser(this.currentUser.id, this.currentUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // TODO: Exibir notificação de sucesso
            this.loadUsers(); // Recarrega para obter os dados atualizados
            this.cancelEdit();
          },
          error: (err) => console.error('Erro ao atualizar usuário:', err)
        });
    } else {
      // Para criação, removemos 'id' e 'active' se o backend não os espera
      const { id, active, ...newUserPayload } = this.currentUser;
      this.userService.createUser(newUserPayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // TODO: Exibir notificação de sucesso
            this.loadUsers(); // Recarrega para incluir o novo usuário
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

  toggleActive(user: User): void {
    const newStatus = !user.active;
    this.userService.toggleUserActiveStatus(user.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          // Atualiza o status do usuário na lista local para feedback instantâneo
          const index = this.filteredUsers.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.filteredUsers[index].active = updatedUser.active;
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
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== id);
        },
        error: (error: any) => {
          console.error('Erro ao excluir usuário:', error);
        }
      });
  }
}