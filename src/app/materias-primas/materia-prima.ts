import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MateriaPrima } from '../core/models/materia-prima.model';

@Injectable({ providedIn: 'root' })
export class MateriaPrimaService {
  private apiUrl = 'http://localhost:8080/api/materias-primas';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<MateriaPrima[]> {
    return this.http.get<MateriaPrima[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<MateriaPrima> {
    return this.http.get<MateriaPrima>(`${this.apiUrl}/${id}`);
  }

  criar(materiaPrima: MateriaPrima): Observable<MateriaPrima> {
    return this.http.post<MateriaPrima>(this.apiUrl, materiaPrima);
  }

  atualizar(id: number, materiaPrima: MateriaPrima): Observable<MateriaPrima> {
    return this.http.put<MateriaPrima>(`${this.apiUrl}/${id}`, materiaPrima);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  adicionarEstoque(id: number, quantidade: number): Observable<MateriaPrima> {
    return this.http.patch<MateriaPrima>(`${this.apiUrl}/${id}/entrada`, { quantidade });
  }

  removerEstoque(id: number, quantidade: number): Observable<MateriaPrima> {
    return this.http.patch<MateriaPrima>(`${this.apiUrl}/${id}/saida`, { quantidade });
  }
}
