import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoAcabadoService } from '../produto-acabado';
import { ProdutoAcabado } from '../../core/models/produto-acabado.model';
import { percentualEstoque, statusEstoque } from '../../core/utils/estoque.util';

@Component({
  selector: 'app-produto-acabado-lista',
  imports: [CommonModule, RouterLink],
  templateUrl: './produto-acabado-lista.html',
  styleUrl: './produto-acabado-lista.scss',
})
export class ProdutoAcabadoLista implements OnInit {
  produtos = signal<ProdutoAcabado[]>([]);
  carregando = signal(true);
  erro = signal('');

  percentualEstoque = percentualEstoque;
  statusEstoque = statusEstoque;

  constructor(private produtoService: ProdutoAcabadoService) {}

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

  entrada(item: ProdutoAcabado): void {
    if (!item.id) return;
    const valor = prompt(`Quantidade de entrada para "${item.nome}":`);
    const quantidade = Number(valor);
    if (!valor || isNaN(quantidade) || quantidade <= 0) return;

    this.produtoService.adicionarEstoque(item.id, quantidade).subscribe({
      next: () => this.carregarProdutos(),
      error: (err) => {
        this.erro.set('Erro ao registrar entrada de estoque.');
        console.error(err);
      },
    });
  }

  saida(item: ProdutoAcabado): void {
    if (!item.id) return;
    const valor = prompt(`Quantidade de saída para "${item.nome}":`);
    const quantidade = Number(valor);
    if (!valor || isNaN(quantidade) || quantidade <= 0) return;

    this.produtoService.removerEstoque(item.id, quantidade).subscribe({
      next: () => this.carregarProdutos(),
      error: (err) => {
        this.erro.set('Erro ao registrar saída de estoque.');
        console.error(err);
      },
    });
  }
}
