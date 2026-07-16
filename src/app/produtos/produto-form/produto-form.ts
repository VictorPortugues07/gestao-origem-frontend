import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../produto';

@Component({
  selector: 'app-produto-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.scss',
})
export class ProdutoForm implements OnInit {
  form!: FormGroup;
  modoEdicao = signal(false);
  produtoId?: number;
  erro = signal('');

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      quantidade: [0, [Validators.required, Validators.min(0)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao.set(true);
      this.produtoId = Number(id);
      this.carregarProduto(this.produtoId);
    }
  }

  carregarProduto(id: number): void {
    this.produtoService.buscarPorId(id).subscribe({
      next: (produto) => this.form.patchValue(produto),
      error: (err) => {
        this.erro.set('Erro ao carregar produto.');
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
      this.modoEdicao() && this.produtoId
        ? this.produtoService.atualizar(this.produtoId, dados)
        : this.produtoService.criar(dados);

    acao.subscribe({
      next: () => this.router.navigate(['/produtos']),
      error: (err) => {
        this.erro.set('Erro ao salvar produto.');
        console.error(err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/produtos']);
  }
}
