import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FornecedorService } from '../fornecedor';
import { Fornecedor } from '../../core/models/fornecedor.model';

@Component({
  selector: 'app-fornecedor-lista',
  imports: [CommonModule, RouterLink],
  templateUrl: './fornecedor-lista.html',
  styleUrl: './fornecedor-lista.scss',
})
export class FornecedorLista implements OnInit {
  fornecedores = signal<Fornecedor[]>([]);
  carregando = signal(true);
  erro = signal('');

  constructor(private fornecedorService: FornecedorService) {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.carregando.set(true);
    this.fornecedorService.listarTodos().subscribe({
      next: (dados) => {
        this.fornecedores.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar fornecedores.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  excluir(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      this.fornecedorService.deletar(id).subscribe({
        next: () => this.carregarFornecedores(),
        error: (err) => {
          this.erro.set('Erro ao excluir fornecedor.');
          console.error(err);
        },
      });
    }
  }
}
