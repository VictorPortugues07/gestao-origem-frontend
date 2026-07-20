import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormulaService } from '../formula';
import { ProdutoAcabadoService } from '../../produtos-acabados/produto-acabado';
import { MateriaPrimaService } from '../../materias-primas/materia-prima';
import { EmbalagemService } from '../../embalagens/embalagem';
import { ProdutoAcabado } from '../../core/models/produto-acabado.model';
import { MateriaPrima } from '../../core/models/materia-prima.model';
import { Embalagem } from '../../core/models/embalagem.model';
import { TipoItemFormula } from '../../core/models/enums';

@Component({
  selector: 'app-formula-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formula-form.html',
  styleUrl: './formula-form.scss',
})
export class FormulaForm implements OnInit {
  form!: FormGroup;
  modoEdicao = signal(false);
  formulaId?: number;
  erro = signal('');
  tiposItem = Object.values(TipoItemFormula);

  produtos = signal<ProdutoAcabado[]>([]);
  materiasPrimas = signal<MateriaPrima[]>([]);
  embalagens = signal<Embalagem[]>([]);

  constructor(
    private fb: FormBuilder,
    private formulaService: FormulaService,
    private produtoService: ProdutoAcabadoService,
    private materiaPrimaService: MateriaPrimaService,
    private embalagemService: EmbalagemService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      produtoAcabadoId: [null, Validators.required],
      rendimento: [null],
      observacoes: [''],
      itens: this.fb.array([]),
    });

    this.produtoService.listarTodos().subscribe({
      next: (dados) => this.produtos.set(dados),
      error: (err) => console.error(err),
    });

    this.materiaPrimaService.listarTodos().subscribe({
      next: (dados) => this.materiasPrimas.set(dados),
      error: (err) => console.error(err),
    });

    this.embalagemService.listarTodos().subscribe({
      next: (dados) => this.embalagens.set(dados),
      error: (err) => console.error(err),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao.set(true);
      this.formulaId = Number(id);
      this.carregarFormula(this.formulaId);
    } else {
      this.adicionarItem();
    }
  }

  criarItem(item?: any) {
    return this.fb.group({
      tipo: [item?.tipo ?? TipoItemFormula.MATERIA_PRIMA, Validators.required],
      materiaPrimaId: [item?.materiaPrimaId ?? null],
      embalagemId: [item?.embalagemId ?? null],
      quantidade: [item?.quantidade ?? null, Validators.required],
    });
  }

  adicionarItem(): void {
    this.itens.push(this.criarItem());
  }

  removerItem(index: number): void {
    this.itens.removeAt(index);
  }

  carregarFormula(id: number): void {
    this.formulaService.buscarPorId(id).subscribe({
      next: (formula) => {
        this.form.patchValue({
          produtoAcabadoId: formula.produtoAcabadoId,
          rendimento: formula.rendimento,
          observacoes: formula.observacoes,
        });

        this.itens.clear();
        formula.itens.forEach((item) => this.itens.push(this.criarItem(item)));
      },
      error: (err) => {
        this.erro.set('Erro ao carregar fórmula.');
        console.error(err);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid || this.itens.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.value;
    const acao =
      this.modoEdicao() && this.formulaId
        ? this.formulaService.atualizar(this.formulaId, dados)
        : this.formulaService.criar(dados);

    acao.subscribe({
      next: () => this.router.navigate(['/formulas']),
      error: (err) => {
        this.erro.set('Erro ao salvar fórmula.');
        console.error(err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/formulas']);
  }
}
