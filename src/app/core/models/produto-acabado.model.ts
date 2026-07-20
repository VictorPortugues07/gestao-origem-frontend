import { UnidadeMedida } from './enums';

export interface ProdutoAcabado {
  id?: number;
  codigo?: string;
  nome: string;
  categoriaId?: number;
  categoriaNome?: string;
  descricao?: string;
  peso?: number;
  volume?: number;
  unidadeMedida?: UnidadeMedida;
  quantidadeEstoque?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  precoCusto?: number;
  precoVenda?: number;
  margemPercentual?: number;
  codigoBarras?: string;
  foto?: string;
  ativo?: boolean;
  estoqueBaixo?: boolean;
}
