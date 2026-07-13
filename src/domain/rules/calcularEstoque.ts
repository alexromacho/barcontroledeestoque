import { validarSaidaEstoque, validarQuantidadePositiva } from "./validarMovimentacao";

export function calcularEstoqueAposSaida(estoqueAtual: number, quantidade: number) {
  validarSaidaEstoque(estoqueAtual, quantidade);
  return estoqueAtual - quantidade;
}

export function calcularEstoqueAposEntrada(estoqueAtual: number, quantidade: number) {
  validarQuantidadePositiva(quantidade);
  return estoqueAtual + quantidade;
}
