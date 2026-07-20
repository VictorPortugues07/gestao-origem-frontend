import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formula, ProducaoResultado } from '../core/models/formula.model';

@Injectable({ providedIn: 'root' })
export class FormulaService {
  private apiUrl = 'http://localhost:8080/api/formulas';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Formula[]> {
    return this.http.get<Formula[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Formula> {
    return this.http.get<Formula>(`${this.apiUrl}/${id}`);
  }

  buscarPorProduto(produtoId: number): Observable<Formula> {
    return this.http.get<Formula>(`${this.apiUrl}/produto/${produtoId}`);
  }

  criar(formula: Formula): Observable<Formula> {
    return this.http.post<Formula>(this.apiUrl, formula);
  }

  atualizar(id: number, formula: Formula): Observable<Formula> {
    return this.http.put<Formula>(`${this.apiUrl}/${id}`, formula);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  produzir(produtoId: number, quantidade: number): Observable<ProducaoResultado> {
    return this.http.post<ProducaoResultado>(`${this.apiUrl}/produto/${produtoId}/produzir`, {
      quantidade,
    });
  }
}
