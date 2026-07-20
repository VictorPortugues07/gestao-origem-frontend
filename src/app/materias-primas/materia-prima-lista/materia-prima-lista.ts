import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MateriaPrimaService } from '../materia-prima';
import { MateriaPrima } from '../../core/models/materia-prima.model';

@Component({
  selector: 'app-materia-prima-lista',
  imports: [CommonModule, RouterLink],
  templateUrl: './materia-prima-lista.html',
  styleUrl: './materia-prima-lista.scss',
})
export class MateriaPrimaLista implements OnInit {
  materiasPrimas = signal<MateriaPrima[]>([]);
  carregando = signal(true);
  erro = signal('');

  constructor(private materiaPrimaService: MateriaPrimaService) {}

  ngOnInit(): void {
    this.carregarMateriasPrimas();
  }

  carregarMateriasPrimas(): void {
    this.carregando.set(true);
    this.materiaPrimaService.listarTodos().subscribe({
      next: (dados) => {
        this.materiasPrimas.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar matérias-primas.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  excluir(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir esta matéria-prima?')) {
      this.materiaPrimaService.deletar(id).subscribe({
        next: () => this.carregarMateriasPrimas(),
        error: (err) => {
          this.erro.set('Erro ao excluir matéria-prima.');
          console.error(err);
        },
      });
    }
  }

  entrada(item: MateriaPrima): void {
    if (!item.id) return;
    const valor = prompt(`Quantidade de entrada para "${item.nome}":`);
    const quantidade = Number(valor);
    if (!valor || isNaN(quantidade) || quantidade <= 0) return;

    this.materiaPrimaService.adicionarEstoque(item.id, quantidade).subscribe({
      next: () => this.carregarMateriasPrimas(),
      error: (err) => {
        this.erro.set('Erro ao registrar entrada de estoque.');
        console.error(err);
      },
    });
  }

  saida(item: MateriaPrima): void {
    if (!item.id) return;
    const valor = prompt(`Quantidade de saída para "${item.nome}":`);
    const quantidade = Number(valor);
    if (!valor || isNaN(quantidade) || quantidade <= 0) return;

    this.materiaPrimaService.removerEstoque(item.id, quantidade).subscribe({
      next: () => this.carregarMateriasPrimas(),
      error: (err) => {
        this.erro.set('Erro ao registrar saída de estoque.');
        console.error(err);
      },
    });
  }
}
