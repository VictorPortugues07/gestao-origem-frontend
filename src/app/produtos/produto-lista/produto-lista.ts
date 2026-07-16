import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../produto';
import { Produto } from '../../core/models/produto.model';

@Component({
  selector: 'app-produto-lista',
  imports: [CommonModule, RouterLink],
  templateUrl: './produto-lista.html',
  styleUrl: './produto-lista.scss',
})
export class ProdutoLista implements OnInit {
  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal('');

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando.set(true);
    this.produtoService.listarTodos().subscribe({
      next: (dados) => {
        this.produtos.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar produtos.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  excluir(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.deletar(id).subscribe({
        next: () => this.carregarProdutos(),
        error: (err) => {
          this.erro.set('Erro ao excluir produto.');
          console.error(err);
        },
      });
    }
  }
}
