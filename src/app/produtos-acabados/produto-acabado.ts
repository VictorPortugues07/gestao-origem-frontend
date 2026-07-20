import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoAcabado } from '../core/models/produto-acabado.model';

@Injectable({ providedIn: 'root' })
export class ProdutoAcabadoService {
  private apiUrl = 'http://localhost:8080/api/produtos-acabados';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ProdutoAcabado[]> {
    return this.http.get<ProdutoAcabado[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<ProdutoAcabado> {
    return this.http.get<ProdutoAcabado>(`${this.apiUrl}/${id}`);
  }

  criar(produto: ProdutoAcabado): Observable<ProdutoAcabado> {
    return this.http.post<ProdutoAcabado>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: ProdutoAcabado): Observable<ProdutoAcabado> {
    return this.http.put<ProdutoAcabado>(`${this.apiUrl}/${id}`, produto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  adicionarEstoque(id: number, quantidade: number): Observable<ProdutoAcabado> {
    return this.http.patch<ProdutoAcabado>(`${this.apiUrl}/${id}/entrada`, { quantidade });
  }

  removerEstoque(id: number, quantidade: number): Observable<ProdutoAcabado> {
    return this.http.patch<ProdutoAcabado>(`${this.apiUrl}/${id}/saida`, { quantidade });
  }
}
