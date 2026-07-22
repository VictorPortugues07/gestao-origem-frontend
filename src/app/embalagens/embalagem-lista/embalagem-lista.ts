import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmbalagemService } from '../embalagem';
import { Embalagem } from '../../core/models/embalagem.model';
import { percentualEstoque, statusEstoque } from '../../core/utils/estoque.util';

@Component({
  selector: 'app-embalagem-lista',
  imports: [CommonModule, RouterLink],
  templateUrl: './embalagem-lista.html',
  styleUrl: './embalagem-lista.scss',
})
export class EmbalagemLista implements OnInit {
  embalagens = signal<Embalagem[]>([]);
  carregando = signal(true);
  erro = signal('');

  percentualEstoque = percentualEstoque;
  statusEstoque = statusEstoque;

  constructor(private embalagemService: EmbalagemService) {}

  ngOnInit(): void {
    this.carregarEmbalagens();
  }

  carregarEmbalagens(): void {
    this.carregando.set(true);
    this.embalagemService.listarTodos().subscribe({
      next: (dados) => {
        this.embalagens.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar embalagens.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  excluir(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir esta embalagem?')) {
      this.embalagemService.deletar(id).subscribe({
        next: () => this.carregarEmbalagens(),
        error: (err) => {
          this.erro.set('Erro ao excluir embalagem.');
          console.error(err);
        },
      });
    }
  }

  entrada(item: Embalagem): void {
    if (!item.id) return;
    const valor = prompt(`Quantidade de entrada para "${item.nome}":`);
    const quantidade = Number(valor);
    if (!valor || isNaN(quantidade) || quantidade <= 0) return;

    this.embalagemService.adicionarEstoque(item.id, quantidade).subscribe({
      next: () => this.carregarEmbalagens(),
      error: (err) => {
        this.erro.set('Erro ao registrar entrada de estoque.');
        console.error(err);
      },
    });
  }

  saida(item: Embalagem): void {
    if (!item.id) return;
    const valor = prompt(`Quantidade de saída para "${item.nome}":`);
    const quantidade = Number(valor);
    if (!valor || isNaN(quantidade) || quantidade <= 0) return;

    this.embalagemService.removerEstoque(item.id, quantidade).subscribe({
      next: () => this.carregarEmbalagens(),
      error: (err) => {
        this.erro.set('Erro ao registrar saída de estoque.');
        console.error(err);
      },
    });
  }
}
