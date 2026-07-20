import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FornecedorService } from '../fornecedor';

@Component({
  selector: 'app-fornecedor-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fornecedor-form.html',
  styleUrl: './fornecedor-form.scss',
})
export class FornecedorForm implements OnInit {
  form!: FormGroup;
  modoEdicao = signal(false);
  fornecedorId?: number;
  erro = signal('');

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cnpj: [''],
      contato: [''],
      telefone: [''],
      email: ['', Validators.email],
      endereco: [''],
      observacoes: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao.set(true);
      this.fornecedorId = Number(id);
      this.carregarFornecedor(this.fornecedorId);
    }
  }

  carregarFornecedor(id: number): void {
    this.fornecedorService.buscarPorId(id).subscribe({
      next: (fornecedor) => this.form.patchValue(fornecedor),
      error: (err) => {
        this.erro.set('Erro ao carregar fornecedor.');
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
      this.modoEdicao() && this.fornecedorId
        ? this.fornecedorService.atualizar(this.fornecedorId, dados)
        : this.fornecedorService.criar(dados);

    acao.subscribe({
      next: () => this.router.navigate(['/fornecedores']),
      error: (err) => {
        this.erro.set('Erro ao salvar fornecedor.');
        console.error(err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/fornecedores']);
  }
}
