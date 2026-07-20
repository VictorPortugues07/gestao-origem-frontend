import { CategoriaTipo } from './enums';

export interface Categoria {
  id?: number;
  nome: string;
  tipo: CategoriaTipo;
  descricao?: string;
}
