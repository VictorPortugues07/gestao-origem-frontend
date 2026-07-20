import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Embalagem } from '../core/models/embalagem.model';

@Injectable({ providedIn: 'root' })
export class EmbalagemService {
  private apiUrl = 'http://localhost:8080/api/embalagens';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Embalagem[]> {
    return this.http.get<Embalagem[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Embalagem> {
    return this.http.get<Embalagem>(`${this.apiUrl}/${id}`);
  }

  criar(embalagem: Embalagem): Observable<Embalagem> {
    return this.http.post<Embalagem>(this.apiUrl, embalagem);
  }

  atualizar(id: number, embalagem: Embalagem): Observable<Embalagem> {
    return this.http.put<Embalagem>(`${this.apiUrl}/${id}`, embalagem);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  adicionarEstoque(id: number, quantidade: number): Observable<Embalagem> {
    return this.http.patch<Embalagem>(`${this.apiUrl}/${id}/entrada`, { quantidade });
  }

  removerEstoque(id: number, quantidade: number): Observable<Embalagem> {
    return this.http.patch<Embalagem>(`${this.apiUrl}/${id}/saida`, { quantidade });
  }
}
