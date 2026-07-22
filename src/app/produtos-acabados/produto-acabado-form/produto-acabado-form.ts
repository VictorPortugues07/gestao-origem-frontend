import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoAcabadoService } from '../produto-acabado';
import { CategoriaService } from '../../categorias/categoria';
import { Categoria } from '../../core/models/categoria.model';
import { UnidadeMedida, CategoriaTipo } from '../../core/models/enums';
import { percentualEstoque, statusEstoque } from '../../core/utils/estoque.util';
import { proximoCodigo } from '../../core/utils/codigo.util';

@Component({
  selector: 'app-produto-acabado-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produto-acabado-form.html',
  styleUrl: './produto-acabado-form.scss',
})
export class ProdutoAcabadoForm implements OnInit {
  form!: FormGroup;
  modoEdicao = signal(false);
  produtoId?: number;
  erro = signal('');
  unidades = Object.values(UnidadeMedida);
  categorias = signal<Categoria[]>([]);

  percentualEstoque = percentualEstoque;
  statusEstoque = statusEstoque;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoAcabadoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: [''],
      nome: ['', Validators.required],
      categoriaId: [null],
      descricao: [''],
      tipoMedida: ['peso'],
      peso: [null],
      volume: [null],
      unidadeMedida: [''],
      quantidadeEstoque: [0],
      estoqueMinimo: [0],
      estoqueMaximo: [null],
      precoCusto: [null],
      precoVenda: [null],
      ativo: [true],
    });

    this.categoriaService.listarTodos(CategoriaTipo.PRODUTO_ACABADO).subscribe({
      next: (dados) => this.categorias.set(dados),
      error: (err) => console.error(err),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao.set(true);
      this.produtoId = Number(id);
      this.carregarProduto(this.produtoId);
    } else {
      this.gerarProximoCodigo();
    }
  }

  gerarProximoCodigo(): void {
    this.produtoService.listarTodos().subscribe({
      next: (dados) => {
        const proximo = proximoCodigo(
          dados.map((d) => d.codigo),
          'PA',
        );
        this.form.patchValue({ codigo: proximo });
      },
      error: (err) => console.error(err),
    });
  }

  carregarProduto(id: number): void {
    this.produtoService.buscarPorId(id).subscribe({
      next: (item) => {
        this.form.patchValue({
          ...item,
          tipoMedida: item.volume ? 'volume' : 'peso',
        });
      },
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

    const { tipoMedida, ...dados } = this.form.value;
    if (tipoMedida === 'peso') {
      dados.volume = null;
    } else {
      dados.peso = null;
    }

    const acao =
      this.modoEdicao() && this.produtoId
        ? this.produtoService.atualizar(this.produtoId, dados)
        : this.produtoService.criar(dados);

    acao.subscribe({
      next: () => this.router.navigate(['/produtos-acabados']),
      error: (err) => {
        this.erro.set('Erro ao salvar produto.');
        console.error(err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/produtos-acabados']);
  }
}
