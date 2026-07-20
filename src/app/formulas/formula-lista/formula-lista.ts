import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormulaService } from '../formula';
import { Formula } from '../../core/models/formula.model';

@Component({
  selector: 'app-formula-lista',
  imports: [CommonModule, RouterLink],
  templateUrl: './formula-lista.html',
  styleUrl: './formula-lista.scss',
})
export class FormulaLista implements OnInit {
  formulas = signal<Formula[]>([]);
  carregando = signal(true);
  erro = signal('');

  constructor(private formulaService: FormulaService) {}

  ngOnInit(): void {
    this.carregarFormulas();
  }

  carregarFormulas(): void {
    this.carregando.set(true);
    this.formulaService.listarTodos().subscribe({
      next: (dados) => {
        this.formulas.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar fórmulas.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  excluir(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir esta fórmula?')) {
      this.formulaService.deletar(id).subscribe({
        next: () => this.carregarFormulas(),
        error: (err) => {
          this.erro.set('Erro ao excluir fórmula.');
          console.error(err);
        },
      });
    }
  }

  produzir(formula: Formula): void {
    const valor = prompt(`Quantidade a produzir de "${formula.produtoAcabadoNome}":`);
    const quantidade = Number(valor);
    if (!valor || isNaN(quantidade) || quantidade <= 0) return;

    this.formulaService.produzir(formula.produtoAcabadoId, quantidade).subscribe({
      next: (resultado) => {
        alert(
          `Produção realizada! Estoque atualizado para "${resultado.produto?.nome ?? formula.produtoAcabadoNome}".`,
        );
        this.carregarFormulas();
      },
      error: (err) => {
        this.erro.set('Erro ao produzir. Verifique se há estoque suficiente de insumos.');
        console.error(err);
      },
    });
  }
}
