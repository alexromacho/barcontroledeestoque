import { describe, expect, it } from "vitest";
import type { MovimentacaoEstoque } from "../../domain/entities/MovimentacaoEstoque";
import { MovimentacaoRepositoryMemoria } from "./MovimentacaoRepositoryMemoria";

const movimentacao: MovimentacaoEstoque = {
  id: "mov-1",
  productId: "produto-1",
  tipo: "entrada",
  date: "12/07/2026",
  time: "18:30",
  productName: "Água sem gás",
  category: "Água",
  quantity: 3,
  unit: "fardos",
  previousStock: 5,
  currentStock: 8,
  supplier: "Caio Aragua",
};

describe("MovimentacaoRepositoryMemoria", () => {
  it("lista vazio quando não há movimentações", async () => {
    const repositorio = new MovimentacaoRepositoryMemoria();
    await expect(repositorio.listar()).resolves.toEqual([]);
  });

  it("registra e lista com a mais recente primeiro", async () => {
    const repositorio = new MovimentacaoRepositoryMemoria();
    await repositorio.registrar(movimentacao);
    await repositorio.registrar({ ...movimentacao, id: "mov-2" });

    const resultado = await repositorio.listar();
    expect(resultado.map((item) => item.id)).toEqual(["mov-2", "mov-1"]);
  });
});
