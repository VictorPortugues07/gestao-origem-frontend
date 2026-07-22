export function proximoCodigo(
  codigosExistentes: (string | undefined)[],
  prefixo: string,
  digitos = 4,
): string {
  let maior = 0;
  const regex = new RegExp(`^${prefixo}(\\d+)$`, 'i');

  for (const codigo of codigosExistentes) {
    if (!codigo) continue;
    const match = codigo.match(regex);
    if (match) {
      const numero = parseInt(match[1], 10);
      if (numero > maior) maior = numero;
    }
  }

  const proximo = maior + 1;
  return `${prefixo}${String(proximo).padStart(digitos, '0')}`;
}
