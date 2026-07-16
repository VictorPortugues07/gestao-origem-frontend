import { Routes } from '@angular/router';
import { ProdutoLista } from './produtos/produto-lista/produto-lista';
import { ProdutoForm } from './produtos/produto-form/produto-form';
import { ComponenteLista } from './componentes/componente-lista/componente-lista';
import { ComponenteForm } from './componentes/componente-form/componente-form';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },

  { path: 'produtos', component: ProdutoLista },
  { path: 'produtos/novo', component: ProdutoForm },
  { path: 'produtos/editar/:id', component: ProdutoForm },

  { path: 'componentes', component: ComponenteLista },
  { path: 'componentes/novo', component: ComponenteForm },
  { path: 'componentes/editar/:id', component: ComponenteForm },
];
