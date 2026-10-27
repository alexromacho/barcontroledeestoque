import { describe, expect, it } from "vitest";
import type { MovimentacaoEstoque } from "../../../domain/entities/MovimentacaoEstoque";
import type { MovimentacaoComRelacoesRow } from "../database.types";
import { mapMovimentacaoDomainToInsert, mapMovimentacaoRowToDomain } from "./movimentacaoMapper";

const createdAt = "2026-07-12T21:30:00Z";
const dataCriada = new Date(createdAt);

const row: MovimentacaoComRelacoesRow = {
  id: "9f1b7e2a-3333-4a11-8a11-000000000003",
  product_id: "9f1b7e2a-1111-4a11-8a11-000000000001",
  movement_type: "entrada",
  quantity: 3,
  previous_stock: 5,
  current_stock: 8,
  note: "",
  invoice_image_path: null,
  created_at: createdAt,
  products: { name: "Água sem gás", category: "Água", unit: "fardos", suppliers: { name: "Caio Aragua" } },
};

describe("movimentacaoMapper", () => {
  it("converte uma movimentação persistida para o domínio", () => {
    expect(mapMovimentacaoRowToDomain(row)).toEqual({
      id: row.id,
      tipo: "entrada",
      date: dataCriada.toLocaleDateString("pt-BR"),
      time: dataCriada.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      productName: "Água sem gás",
      category: "Água",
      quantity: 3,
      unit: "fardos",
      previousStock: 5,
      currentStock: 8,
      supplier: "Caio Aragua",
    });
  });

  it("converte o domínio para inserção associada ao produto", () => {
    const movimentacao: MovimentacaoEstoque = mapMovimentacaoRowToDomain(row);
    expect(mapMovimentacaoDomainToInsert(movimentacao, row.product_id)).toEqual({
      product_id: row.product_id,
      movement_type: "entrada",
      quantity: 3,
      previous_stock: 5,
      current_stock: 8,
      note: "",
      invoice_image_path: null,
    });
  });

  it("falha claramente quando o tipo 'ajuste' ainda não suportado é retornado", () => {
    expect(() => mapMovimentacaoRowToDomain({ ...row, movement_type: "ajuste" })).toThrow(
      `Movimentação ${row.id}: tipo "ajuste" ainda não é suportado no domínio.`,
    );
  });

  it("falha claramente quando as relações não foram retornadas", () => {
    expect(() => mapMovimentacaoRowToDomain({ ...row, products: null })).toThrow(
      `Relações não encontradas para a movimentação ${row.id}.`,
    );
  });
});
