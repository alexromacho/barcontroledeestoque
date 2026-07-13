import { describe, expect, it } from "vitest";
import { calcularNecessidadeCompra } from "./calcularNecessidadeCompra";

describe("calcularNecessidadeCompra", () => {
  it("calcula quanto falta para atingir o estoque mínimo", () => {
    expect(calcularNecessidadeCompra(4, 10)).toBe(6);
  });

  it("retorna zero quando o produto está exatamente no mínimo", () => {
    expect(calcularNecessidadeCompra(10, 10)).toBe(0);
  });

  it("retorna zero quando o produto está acima do mínimo", () => {
    expect(calcularNecessidadeCompra(12, 10)).toBe(0);
  });
});
