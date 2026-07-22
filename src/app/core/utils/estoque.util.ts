export type StatusEstoque = 'baixo' | 'ideal' | 'alto';

export function percentualEstoque(
  atual?: number | null,
  minimo?: number | null,
  maximo?: number | null,
): number {
  const a = atual ?? 0;

  if (maximo && maximo > 0) {
    return Math.min(100, Math.max(0, (a / maximo) * 100));
  }

  if (minimo && minimo > 0) {
    return Math.min(100, Math.max(0, (a / (minimo * 2)) * 100));
  }

  return 0;
}

export function statusEstoque(
  atual?: number | null,
  minimo?: number | null,
  maximo?: number | null,
): StatusEstoque {
  const a = atual ?? 0;

  if (minimo != null && a <= minimo) return 'baixo';
  if (maximo != null && maximo > 0 && a >= maximo) return 'alto';
  return 'ideal';
}
