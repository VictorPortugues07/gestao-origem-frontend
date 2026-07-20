import { TipoEmbalagem } from './enums';

export interface Embalagem {
  id?: number;
  nome: string;
  tipo: TipoEmbalagem;
  cor?: string;
  volumeMl?: number;
  quantidadeEstoque?: number;
  estoqueMinimo?: number;
  custoUnitario?: number;
  fornecedorId?: number;
  fornecedorNome?: string;
  ativo?: boolean;
  estoqueBaixo?: boolean;
}
