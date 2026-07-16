import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Componente } from '../core/models/componente.model';

@Injectable({
  providedIn: 'root',
})
export class ComponenteService {
  private apiUrl = 'http://localhost:8080/api/componentes';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Componente[]> {
    return this.http.get<Componente[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Componente> {
    return this.http.get<Componente>(`${this.apiUrl}/${id}`);
  }

  criar(componente: Componente): Observable<Componente> {
    return this.http.post<Componente>(this.apiUrl, componente);
  }

  atualizar(id: number, componente: Componente): Observable<Componente> {
    return this.http.put<Componente>(`${this.apiUrl}/${id}`, componente);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  adicionarEstoque(id: number, quantidade: number): Observable<Componente> {
    return this.http.patch<Componente>(`${this.apiUrl}/${id}/entrada`, { quantidade });
  }

  removerEstoque(id: number, quantidade: number): Observable<Componente> {
    return this.http.patch<Componente>(`${this.apiUrl}/${id}/saida`, { quantidade });
  }
}
