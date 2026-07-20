import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../categoria';
import { CategoriaTipo } from '../../core/models/enums';

@Component({
  selector: 'app-categoria-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.scss',
})
export class CategoriaForm implements OnInit {
  form!: FormGroup;
  modoEdicao = signal(false);
  categoriaId?: number;
  erro = signal('');
  tipos = Object.values(CategoriaTipo);

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      descricao: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao.set(true);
      this.categoriaId = Number(id);
      this.carregarCategoria(this.categoriaId);
    }
  }

  carregarCategoria(id: number): void {
    this.categoriaService.buscarPorId(id).subscribe({
      next: (categoria) => this.form.patchValue(categoria),
      error: (err) => {
        this.erro.set('Erro ao carregar categoria.');
        console.error(err);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.value;
    const acao =
      this.modoEdicao() && this.categoriaId
        ? this.categoriaService.atualizar(this.categoriaId, dados)
        : this.categoriaService.criar(dados);

    acao.subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: (err) => {
        this.erro.set('Erro ao salvar categoria.');
        console.error(err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/categorias']);
  }
}
