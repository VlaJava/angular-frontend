import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../types/user.type';

// Assumindo que a sua API de utilizadores retorna uma resposta paginada
interface UserResponse {
  users: User[];
  // ...outras propriedades
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  /**
   * @method getUsers
   * @description Busca a lista de todos os utilizadores do backend.
   * @param searchTerm - Termo opcional para filtrar os utilizadores no backend.
   */
  getUsers(searchTerm: string = ''): Observable<User[]> {
    const options = searchTerm ? { params: new HttpParams().set('search', searchTerm) } : {};
    return this.http.get<UserResponse>(this.apiUrl, options).pipe(
      map(response => response.users)
    );
  }

  /**
   * @method createUser
   * @description Cria um novo utilizador no backend.
   * @param userData Os dados do novo utilizador.
   */
  // CORREÇÃO: Alterado o tipo para Partial<User> para ser mais flexível.
  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  /**
   * @method updateUser
   * @description Atualiza os dados de um utilizador existente.
   * @param id O ID do utilizador a ser atualizado.
   * @param updatedData Os novos dados do utilizador.
   */
  // CORREÇÃO: Alterado o tipo do ID para aceitar string ou number.
  updateUser(id: string | number, updatedData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, updatedData);
  }
  
  /**
   * @method toggleUserActiveStatus
   * @description Ativa ou desativa um utilizador (Soft Delete).
   * @param id O ID do utilizador.
   * @param newStatus O novo estado (true para ativo, false para inativo).
   */
  // CORREÇÃO: Alterado o tipo do ID para aceitar string ou number.
  toggleUserActiveStatus(id: string | number, newStatus: boolean): Observable<User> {
    // Usamos PATCH para uma atualização parcial, alterando apenas o status
    // O backend precisa de um endpoint para lidar com esta lógica.
    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, { active: newStatus });
  }

  /**
   * @method deleteUser
   * @description Exclui permanentemente um utilizador. Use com cuidado.
   * @param id O ID do utilizador a ser excluído.
   */
  // CORREÇÃO: Alterado o tipo do ID para aceitar string ou number.
  deleteUser(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
