import { describe, expect, it } from "vitest";
import type { Produto } from "../../../domain/entities/Produto";
import type { ProdutoComFornecedorRow } from "../database.types";
import { mapProdutoDomainToInsert, mapProdutoDomainToUpdate, mapProdutoRowToDomain } from "./produtoMapper";

const row: ProdutoComFornecedorRow = {
  id: "9f1b7e2a-1111-4a11-8a11-000000000001",
  supplier_id: "9f1b7e2a-2222-4a11-8a11-000000000002",
  name: "Água sem gás",
  category: "Água",
  unit: "fardo",
  current_stock: 5,
  minimum_stock: 10,
  unit_price: 12.5,
  active: true,
  created_at: "2026-07-12T12:00:00Z",
  updated_at: "2026-07-12T12:00:00Z",
  suppliers: { name: "Caio Aragua" },
};

describe("produtoMapper", () => {
  it("converte snake_case do banco para o domínio", () => {
    expect(mapProdutoRowToDomain(row)).toEqual({
      id: row.id,
      name: "Água sem gás",
      category: "Água",
      supplier: "Caio Aragua",
      unit: "fardo",
      currentStock: 5,
      minimumStock: 10,
      unitPrice: 12.5,
    });
  });

  it("converte o domínio para os campos atualizáveis do banco", () => {
    const produto: Produto = mapProdutoRowToDomain(row);
    expect(mapProdutoDomainToUpdate({ ...produto, currentStock: 8 })).toEqual({
      name: "Água sem gás",
      category: "Água",
      unit: "fardo",
      current_stock: 8,
      minimum_stock: 10,
      unit_price: 12.5,
    });
  });

  it("converte o domínio para os campos de criação, associando o fornecedor pelo id", () => {
    const produto: Produto = mapProdutoRowToDomain(row);
    const { id, ...produtoSemId } = produto;
    expect(mapProdutoDomainToInsert(produtoSemId, row.supplier_id)).toEqual({
      supplier_id: row.supplier_id,
      name: "Água sem gás",
      category: "Água",
      unit: "fardo",
      current_stock: 5,
      minimum_stock: 10,
      unit_price: 12.5,
    });
  });

  it("falha claramente quando a relação do fornecedor não foi retornada", () => {
    expect(() => mapProdutoRowToDomain({ ...row, suppliers: null })).toThrow(
      `Fornecedor não encontrado para o produto ${row.id}.`,
    );
  });
});
