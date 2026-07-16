import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponenteService } from '../componente';

@Component({
  selector: 'app-componente-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './componente-form.html',
  styleUrl: './componente-form.scss',
})
export class ComponenteForm implements OnInit {
  form!: FormGroup;
  modoEdicao = signal(false);
  componenteId?: number;
  erro = signal('');

  constructor(
    private fb: FormBuilder,
    private componenteService: ComponenteService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      unidadeMedida: ['', Validators.required],
      quantidade: [0, [Validators.required, Validators.min(0)]],
      custoUnitario: [0, [Validators.required, Validators.min(0.01)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao.set(true);
      this.componenteId = Number(id);
      this.carregarComponente(this.componenteId);
    }
  }

  carregarComponente(id: number): void {
    this.componenteService.buscarPorId(id).subscribe({
      next: (componente) => this.form.patchValue(componente),
      error: (err) => {
        this.erro.set('Erro ao carregar componente.');
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
      this.modoEdicao() && this.componenteId
        ? this.componenteService.atualizar(this.componenteId, dados)
        : this.componenteService.criar(dados);

    acao.subscribe({
      next: () => this.router.navigate(['/componentes']),
      error: (err) => {
        this.erro.set('Erro ao salvar componente.');
        console.error(err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/componentes']);
  }
}
