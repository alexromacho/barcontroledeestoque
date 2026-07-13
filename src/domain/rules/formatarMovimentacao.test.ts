import { describe, expect, it } from "vitest";
import { formatarQuantidadeMovimentacao, obterRotuloMovimentacao } from "./formatarMovimentacao";

describe("formatar movimentação", () => {
  it("formata uma entrada com sinal positivo", () => {
    expect(formatarQuantidadeMovimentacao("entrada", 3, "garrafa")).toBe("+3 garrafas");
  });

  it("formata uma saída com sinal negativo", () => {
    expect(formatarQuantidadeMovimentacao("saida", 2, "garrafa")).toBe("-2 garrafas");
  });

  it("mantém a unidade no singular para quantidade um", () => {
    expect(formatarQuantidadeMovimentacao("entrada", 1, "fardo")).toBe("+1 fardo");
  });

  it("retorna os rótulos corretos", () => {
    expect(obterRotuloMovimentacao("entrada")).toBe("Entrada");
    expect(obterRotuloMovimentacao("saida")).toBe("Saída");
  });
});
