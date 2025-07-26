// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../types/user.type';

/**
 * @class UserService
 * @description Serviço para gerenciar operações de usuários.
 * Atualmente, usa dados mockados para simular um backend.
 * Em uma aplicação real, faria chamadas HTTP para uma API.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Dados mockados para simular o armazenamento de usuários no backend
  private mockUsers: User[] = [
    { id: 1, name: 'João Silva', email: 'joao.silva@example.com', document: '123.456.789-00', phone: '11987654321', active: true, role: 'CLIENT' },
    { id: 2, name: 'Maria Souza', email: 'maria.souza@example.com', document: '987.654.321-01', phone: '21912345678', active: true, role: 'ADMIN' },
    { id: 3, name: 'Carlos Santos', email: 'carlos.santos@example.com', document: '111.222.333-44', phone: '31998765432', active: false, role: 'CLIENT' },
    { id: 4, name: 'Ana Oliveira', email: 'ana.oliveira@example.com', document: '555.666.777-88', phone: '41911223344', active: true, role: 'CLIENT' },
    { id: 5, name: 'Pedro Costa', email: 'pedro.costa@example.com', document: '999.888.777-66', phone: '51955667788', active: true, role: 'ADMIN' }
  ];

  private nextId: number = this.mockUsers.length > 0 ? Math.max(...this.mockUsers.map(u => u.id)) + 1 : 1;

  constructor() { }

  /**
   * @method getUsers
   * @description Retorna uma lista de usuários, opcionalmente filtrada por um termo de busca.
   * @param searchTerm Termo para buscar por nome, documento ou email.
   * @returns Observable de um array de usuários.
   */
  getUsers(searchTerm: string = ''): Observable<User[]> {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = this.mockUsers.filter(user =>
      user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.document.toLowerCase().includes(lowerCaseSearchTerm)
    );
    // Simula um atraso de rede
    return of(filtered).pipe(delay(300));
  }

  /**
   * @method createUser
   * @description Adiciona um novo usuário.
   * @param user Os dados do novo usuário (sem ID e active, que serão gerados).
   * @returns Observable do usuário criado.
   */
  createUser(user: Omit<User, 'id' | 'active'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: this.nextId++,
      active: true // Novos usuários são ativos por padrão
    };
    this.mockUsers.push(newUser);
    // Simula um atraso de rede
    return of(newUser).pipe(delay(300));
  }

  /**
   * @method updateUser
   * @description Atualiza um usuário existente.
   * @param id O ID do usuário a ser atualizado.
   * @param updatedUser Os novos dados do usuário.
   * @returns Observable do usuário atualizado.
   */
  updateUser(id: number, updatedUser: User): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index > -1) {
      this.mockUsers[index] = { ...updatedUser }; // Garante que a referência do objeto seja atualizada
      // Simula um atraso de rede
      return of(this.mockUsers[index]).pipe(delay(300));
    }
    // Em um cenário real, você lançaria um erro ou retornaria um Observable de erro
    return of(null as any).pipe(delay(300)); // Retorna null para simular falha
  }

  /**
   * @method toggleUserActiveStatus
   * @description Alterna o status de ativação de um usuário (ativo/desabilitado).
   * @param id O ID do usuário.
   * @param newStatus O novo status (true para ativo, false para desabilitado).
   * @returns Observable do usuário com o status atualizado.
   */
  toggleUserActiveStatus(id: number, newStatus: boolean): Observable<User> {
    const user = this.mockUsers.find(u => u.id === id);
    if (user) {
      user.active = newStatus;
      // Simula um atraso de rede
      return of(user).pipe(delay(300));
    }
    // Em um cenário real, você lançaria um erro ou retornaria um Observable de erro
    return of(null as any).pipe(delay(300)); // Retorna null para simular falha
  }

  /**
   * @method deleteUser
   * @description Exclui um usuário.
   * @param id O ID do usuário a ser excluído.
   * @returns Observable vazio (void) após a exclusão.
   */
  deleteUser(id: number): Observable<void> {
    const initialLength = this.mockUsers.length;
    this.mockUsers = this.mockUsers.filter(u => u.id !== id);
    if (this.mockUsers.length < initialLength) {
      // Simula um atraso de rede
      return of(void 0).pipe(delay(300)); // Retorna void para sucesso
    }
    // Em um cenário real, você lançaria um erro ou retornaria um Observable de erro
    return of(null as any).pipe(delay(300)); // Retorna null para simular falha
  }
}
