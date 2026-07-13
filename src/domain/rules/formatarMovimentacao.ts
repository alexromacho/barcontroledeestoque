import type { TipoMovimentacao } from "../../types/estoque";

export function obterRotuloMovimentacao(tipo: TipoMovimentacao) {
  return tipo === "entrada" ? "Entrada" : "Saída";
}

function pluralizarUnidade(unidade: string, quantidade: number) {
  if (quantidade === 1 || unidade.endsWith("s") || unidade.includes("/") || /^(kg|g|ml|l)$/i.test(unidade)) {
    return unidade;
  }

  const irregulares: Record<string, string> = {
    galão: "galões",
    garrafão: "garrafões",
  };
  return irregulares[unidade.toLowerCase()] ?? `${unidade}s`;
}

export function formatarQuantidadeMovimentacao(
  tipo: TipoMovimentacao,
  quantidade: number,
  unidade: string,
) {
  const sinal = tipo === "entrada" ? "+" : "-";
  return `${sinal}${quantidade} ${pluralizarUnidade(unidade, quantidade)}`;
}
