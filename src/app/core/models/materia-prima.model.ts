import { UnidadeMedida } from './enums';

export interface MateriaPrima {
  id?: number;
  sku?: string;
  nome: string;
  nomeInci?: string;
  categoriaId?: number;
  categoriaNome?: string;
  unidadeMedida: UnidadeMedida;
  quantidadeEstoque?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  localizacao?: string;
  loteAtual?: string;
  dataFabricacao?: string;
  dataValidade?: string;
  ativo?: boolean;
  fornecedorId?: number;
  fornecedorNome?: string;
  codigoFornecedor?: string;
  precoCompra?: number;
  dataUltimaCompra?: string;
  densidade?: number;
  phRecomendado?: string;
  solubilidade?: string;
  observacoes?: string;
  estoqueBaixo?: boolean;
}
