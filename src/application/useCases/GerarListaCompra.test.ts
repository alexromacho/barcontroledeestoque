import { describe, expect, it } from "vitest";
import type { ProdutoEstoque } from "../../types/estoque";
import { agruparListaCompraPorFornecedor, gerarListaCompra } from "./GerarListaCompra";

const produtos: ProdutoEstoque[] = [
  { id: "agua", name: "Água", category: "Bebidas", supplier: "Fornecedor A", unit: "fardos", currentStock: 4, minimumStock: 10 },
  { id: "copo", name: "Copo", category: "Descartáveis", supplier: "Fornecedor B", unit: "pacotes", currentStock: 10, minimumStock: 10 },
  { id: "gelo", name: "Gelo", category: "Bebidas", supplier: "Fornecedor A", unit: "sacos", currentStock: 12, minimumStock: 10 },
];

describe("gerarListaCompra", () => {
  it("inclui somente o produto abaixo do mínimo e calcula a quantidade", () => {
    const lista = gerarListaCompra({ produtos, itensManuais: [] });

    expect(lista).toHaveLength(1);
    expect(lista[0]).toMatchObject({ id: "agua", quantityToBuy: 6, origem: "automatico" });
  });

  it("não inclui produtos no mínimo ou acima dele", () => {
    const lista = gerarListaCompra({ produtos, itensManuais: [] });

    expect(lista.some((item) => item.id === "copo")).toBe(false);
    expect(lista.some((item) => item.id === "gelo")).toBe(false);
  });

  it("agrupa itens pelo fornecedor sem duplicá-los", () => {
    const lista = gerarListaCompra({ produtos, itensManuais: [] });
    const grupos = agruparListaCompraPorFornecedor(lista);

    expect(Object.keys(grupos)).toEqual(["Fornecedor A"]);
    expect(grupos["Fornecedor A"]).toHaveLength(1);
    expect(grupos["Fornecedor A"][0].id).toBe("agua");
  });
});
