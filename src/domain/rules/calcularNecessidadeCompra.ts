export function calcularNecessidadeCompra(estoqueAtual: number, estoqueMinimo: number) {
  return Math.max(0, estoqueMinimo - estoqueAtual);
}
