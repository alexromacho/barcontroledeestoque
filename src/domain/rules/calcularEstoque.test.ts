import { describe, expect, it } from "vitest";
import { calcularEstoqueAposSaida } from "./calcularEstoque";

describe("calcularEstoqueAposSaida", () => {
  it("subtrai uma saída válida do estoque", () => {
    expect(calcularEstoqueAposSaida(10, 3)).toBe(7);
  });

  it("rejeita quantidade igual a zero com mensagem clara", () => {
    expect(() => calcularEstoqueAposSaida(10, 0)).toThrow(
      "Informe uma quantidade maior que zero.",
    );
  });

  it("rejeita quantidade negativa", () => {
    expect(() => calcularEstoqueAposSaida(10, -2)).toThrow(
      "Informe uma quantidade maior que zero.",
    );
  });

  it("rejeita saída maior que o estoque sem produzir valor negativo", () => {
    expect(() => calcularEstoqueAposSaida(5, 8)).toThrow(
      "A quantidade informada é maior que o estoque atual.",
    );
  });

  it("permite saída igual ao estoque", () => {
    expect(calcularEstoqueAposSaida(5, 5)).toBe(0);
  });
});
