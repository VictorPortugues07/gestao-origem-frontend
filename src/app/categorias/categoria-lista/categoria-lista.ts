import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../categoria';
import { Categoria } from '../../core/models/categoria.model';

@Component({
  selector: 'app-categoria-lista',
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria-lista.html',
  styleUrl: './categoria-lista.scss',
})
export class CategoriaLista implements OnInit {
  categorias = signal<Categoria[]>([]);
  carregando = signal(true);
  erro = signal('');

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.carregando.set(true);
    this.categoriaService.listarTodos().subscribe({
      next: (dados) => {
        this.categorias.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar categorias.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  excluir(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.categoriaService.deletar(id).subscribe({
        next: () => this.carregarCategorias(),
        error: (err) => {
          this.erro.set('Erro ao excluir categoria.');
          console.error(err);
        },
      });
    }
  }
}
