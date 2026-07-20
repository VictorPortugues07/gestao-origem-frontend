import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MateriaPrimaService } from '../materia-prima';
import { CategoriaService } from '../../categorias/categoria';
import { FornecedorService } from '../../fornecedores/fornecedor';
import { Categoria } from '../../core/models/categoria.model';
import { Fornecedor } from '../../core/models/fornecedor.model';
import { UnidadeMedida, CategoriaTipo } from '../../core/models/enums';

@Component({
  selector: 'app-materia-prima-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './materia-prima-form.html',
  styleUrl: './materia-prima-form.scss',
})
export class MateriaPrimaForm implements OnInit {
  form!: FormGroup;
  modoEdicao = signal(false);
  materiaPrimaId?: number;
  erro = signal('');
  unidades = Object.values(UnidadeMedida);
  categorias = signal<Categoria[]>([]);
  fornecedores = signal<Fornecedor[]>([]);

  constructor(
    private fb: FormBuilder,
    private materiaPrimaService: MateriaPrimaService,
    private categoriaService: CategoriaService,
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sku: [''],
      nome: ['', Validators.required],
      nomeInci: [''],
      categoriaId: [null],
      unidadeMedida: ['', Validators.required],
      quantidadeEstoque: [0],
      estoqueMinimo: [0],
      estoqueMaximo: [null],
      localizacao: [''],
      loteAtual: [''],
      dataFabricacao: [''],
      dataValidade: [''],
      ativo: [true],
      fornecedorId: [null],
      codigoFornecedor: [''],
      precoCompra: [null],
      dataUltimaCompra: [''],
      densidade: [null],
      phRecomendado: [''],
      solubilidade: [''],
      observacoes: [''],
    });

    this.categoriaService.listarTodos(CategoriaTipo.MATERIA_PRIMA).subscribe({
      next: (dados) => this.categorias.set(dados),
      error: (err) => console.error(err),
    });

    this.fornecedorService.listarTodos().subscribe({
      next: (dados) => this.fornecedores.set(dados),
      error: (err) => console.error(err),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao.set(true);
      this.materiaPrimaId = Number(id);
      this.carregarMateriaPrima(this.materiaPrimaId);
    }
  }

  carregarMateriaPrima(id: number): void {
    this.materiaPrimaService.buscarPorId(id).subscribe({
      next: (item) => this.form.patchValue(item),
      error: (err) => {
        this.erro.set('Erro ao carregar matéria-prima.');
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
      this.modoEdicao() && this.materiaPrimaId
        ? this.materiaPrimaService.atualizar(this.materiaPrimaId, dados)
        : this.materiaPrimaService.criar(dados);

    acao.subscribe({
      next: () => this.router.navigate(['/materias-primas']),
      error: (err) => {
        this.erro.set('Erro ao salvar matéria-prima.');
        console.error(err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/materias-primas']);
  }
}
