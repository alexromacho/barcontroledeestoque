import { describe, expect, it } from "vitest";
import type { ProdutoEstoque } from "../../types/estoque";
import { registrarSaidasEstoque, validarSaidaPendente } from "./RegistrarSaidaEstoque";

const produto: ProdutoEstoque = {
  id: "agua-sem-gas",
  name: "Água sem gás",
  category: "Água",
  supplier: "Caio Aragua",
  unit: "fardos",
  currentStock: 10,
  minimumStock: 5,
};

describe("validarSaidaPendente", () => {
  it("considera quantidades já pendentes ao validar o estoque", () => {
    expect(() => validarSaidaPendente(produto, 4, 7)).toThrow(
      "A quantidade informada é maior que o estoque atual.",
    );
  });
});

describe("registrarSaidasEstoque", () => {
  it("atualiza o produto e cria a movimentação com os dados corretos", () => {
    const data = new Date(2026, 0, 15, 14, 30);
    const resultado = registrarSaidasEstoque([produto], { [produto.id]: 3 }, data, () => "id-fixo");

    expect(resultado.produtosAtualizados[0].currentStock).toBe(7);
    expect(resultado.movimentacoes).toHaveLength(1);
    expect(resultado.movimentacoes[0]).toMatchObject({
      tipo: "saida",
      productName: "Água sem gás",
      category: "Água",
      quantity: 3,
      unit: "fardos",
      previousStock: 10,
      currentStock: 7,
      supplier: "Caio Aragua",
      date: "15/01/2026",
      time: "14:30",
    });
    expect(resultado.movimentacoes[0].id).toContain("agua-sem-gas-id-fixo");
  });

  it("não altera a coleção original", () => {
    registrarSaidasEstoque([produto], { [produto.id]: 3 }, new Date(2026, 0, 15), () => "id");
    expect(produto.currentStock).toBe(10);
  });
});
