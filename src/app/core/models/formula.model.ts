import { TipoItemFormula } from './enums';

export interface ItemFormula {
  id?: number;
  tipo: TipoItemFormula;
  materiaPrimaId?: number | null;
  materiaPrimaNome?: string;
  embalagemId?: number | null;
  embalagemNome?: string;
  quantidade: number;
}

export interface Formula {
  id?: number;
  produtoAcabadoId: number;
  produtoAcabadoNome?: string;
  rendimento?: number;
  observacoes?: string;
  itens: ItemFormula[];
}

export interface ConsumoItem {
  tipo: TipoItemFormula;
  materiaPrimaId?: number;
  materiaPrimaNome?: string;
  embalagemId?: number;
  embalagemNome?: string;
  quantidadeConsumida?: number;
}

export interface ProducaoResultado {
  produto: any;
  consumos: ConsumoItem[];
}
