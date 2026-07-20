import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmbalagemService } from '../embalagem';
import { FornecedorService } from '../../fornecedores/fornecedor';
import { Fornecedor } from '../../core/models/fornecedor.model';
import { TipoEmbalagem } from '../../core/models/enums';

@Component({
  selector: 'app-embalagem-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './embalagem-form.html',
  styleUrl: './embalagem-form.scss',
})
export class EmbalagemForm implements OnInit {
  form!: FormGroup;
  modoEdicao = signal(false);
  embalagemId?: number;
  erro = signal('');
  tipos = Object.values(TipoEmbalagem);
  fornecedores = signal<Fornecedor[]>([]);

  constructor(
    private fb: FormBuilder,
    private embalagemService: EmbalagemService,
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      cor: [''],
      volumeMl: [null],
      quantidadeEstoque: [0],
      estoqueMinimo: [0],
      custoUnitario: [null],
      fornecedorId: [null],
      ativo: [true],
    });

    this.fornecedorService.listarTodos().subscribe({
      next: (dados) => this.fornecedores.set(dados),
      error: (err) => console.error(err),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao.set(true);
      this.embalagemId = Number(id);
      this.carregarEmbalagem(this.embalagemId);
    }
  }

  carregarEmbalagem(id: number): void {
    this.embalagemService.buscarPorId(id).subscribe({
      next: (item) => this.form.patchValue(item),
      error: (err) => {
        this.erro.set('Erro ao carregar embalagem.');
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
      this.modoEdicao() && this.embalagemId
        ? this.embalagemService.atualizar(this.embalagemId, dados)
        : this.embalagemService.criar(dados);

    acao.subscribe({
      next: () => this.router.navigate(['/embalagens']),
      error: (err) => {
        this.erro.set('Erro ao salvar embalagem.');
        console.error(err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/embalagens']);
  }
}
