import { describe, expect, it } from "vitest";
import type { ProdutoEstoque } from "../../types/estoque";
import { registrarEntradaEstoque } from "./RegistrarEntradaEstoque";

const produto: ProdutoEstoque = {
  id: "agua-com-gas",
  name: "Água com gás",
  category: "Água",
  supplier: "Caio Aragua",
  unit: "fardos",
  currentStock: 5,
  minimumStock: 6,
};

describe("registrarEntradaEstoque", () => {
  it("soma uma entrada válida ao estoque e registra a movimentação", () => {
    const data = new Date(2026, 1, 20, 9, 45);
    const resultado = registrarEntradaEstoque([produto], produto.id, 3, data, () => "entrada-id");

    expect(resultado.produtoAtualizado.currentStock).toBe(8);
    expect(resultado.produtosAtualizados[0].currentStock).toBe(8);
    expect(resultado.movimentacao).toMatchObject({
      tipo: "entrada",
      productName: "Água com gás",
      category: "Água",
      quantity: 3,
      unit: "fardos",
      previousStock: 5,
      currentStock: 8,
      supplier: "Caio Aragua",
      date: "20/02/2026",
      time: "09:45",
    });
    expect(resultado.movimentacao.id).toContain("agua-com-gas-entrada-id");
  });

  it("rejeita entrada igual a zero", () => {
    expect(() => registrarEntradaEstoque([produto], produto.id, 0)).toThrow(
      "Informe uma quantidade maior que zero.",
    );
  });

  it("rejeita entrada negativa", () => {
    expect(() => registrarEntradaEstoque([produto], produto.id, -1)).toThrow(
      "Informe uma quantidade maior que zero.",
    );
  });

  it("não altera diretamente o produto original", () => {
    registrarEntradaEstoque([produto], produto.id, 3, new Date(2026, 1, 20), () => "id");
    expect(produto.currentStock).toBe(5);
  });
});
