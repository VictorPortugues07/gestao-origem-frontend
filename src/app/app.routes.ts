import { Routes } from '@angular/router';
import { CategoriaLista } from './categorias/categoria-lista/categoria-lista';
import { CategoriaForm } from './categorias/categoria-form/categoria-form';
import { FornecedorLista } from './fornecedores/fornecedor-lista/fornecedor-lista';
import { FornecedorForm } from './fornecedores/fornecedor-form/fornecedor-form';
import { MateriaPrimaLista } from './materias-primas/materia-prima-lista/materia-prima-lista';
import { MateriaPrimaForm } from './materias-primas/materia-prima-form/materia-prima-form';
import { EmbalagemLista } from './embalagens/embalagem-lista/embalagem-lista';
import { EmbalagemForm } from './embalagens/embalagem-form/embalagem-form';
import { ProdutoAcabadoLista } from './produtos-acabados/produto-acabado-lista/produto-acabado-lista';
import { ProdutoAcabadoForm } from './produtos-acabados/produto-acabado-form/produto-acabado-form';
import { FormulaLista } from './formulas/formula-lista/formula-lista';
import { FormulaForm } from './formulas/formula-form/formula-form';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos-acabados', pathMatch: 'full' },

  { path: 'categorias', component: CategoriaLista },
  { path: 'categorias/novo', component: CategoriaForm },
  { path: 'categorias/editar/:id', component: CategoriaForm },

  { path: 'fornecedores', component: FornecedorLista },
  { path: 'fornecedores/novo', component: FornecedorForm },
  { path: 'fornecedores/editar/:id', component: FornecedorForm },

  { path: 'materias-primas', component: MateriaPrimaLista },
  { path: 'materias-primas/novo', component: MateriaPrimaForm },
  { path: 'materias-primas/editar/:id', component: MateriaPrimaForm },

  { path: 'embalagens', component: EmbalagemLista },
  { path: 'embalagens/novo', component: EmbalagemForm },
  { path: 'embalagens/editar/:id', component: EmbalagemForm },

  { path: 'produtos-acabados', component: ProdutoAcabadoLista },
  { path: 'produtos-acabados/novo', component: ProdutoAcabadoForm },
  { path: 'produtos-acabados/editar/:id', component: ProdutoAcabadoForm },

  { path: 'formulas', component: FormulaLista },
  { path: 'formulas/novo', component: FormulaForm },
  { path: 'formulas/editar/:id', component: FormulaForm },
];
