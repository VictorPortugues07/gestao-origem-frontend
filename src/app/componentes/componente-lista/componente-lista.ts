import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComponenteService } from '../componente';
import { Componente } from '../../core/models/componente.model';

@Component({
  selector: 'app-componente-lista',
  imports: [CommonModule, RouterLink],
  templateUrl: './componente-lista.html',
  styleUrl: './componente-lista.scss',
})
export class ComponenteLista implements OnInit {
  componentes = signal<Componente[]>([]);
  carregando = signal(true);
  erro = signal('');

  constructor(private componenteService: ComponenteService) {}

  ngOnInit(): void {
    this.carregarComponentes();
  }

  carregarComponentes(): void {
    this.carregando.set(true);
    this.componenteService.listarTodos().subscribe({
      next: (dados) => {
        this.componentes.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar componentes.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  excluir(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem certeza que deseja excluir este componente?')) {
      this.componenteService.deletar(id).subscribe({
        next: () => this.carregarComponentes(),
        error: (err) => {
          this.erro.set('Erro ao excluir componente.');
          console.error(err);
        },
      });
    }
  }
}
