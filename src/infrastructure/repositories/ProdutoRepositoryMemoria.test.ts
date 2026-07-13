import { describe, expect, it } from "vitest";
import type { ProdutoEstoque } from "../../types/estoque";
import { ProdutoRepositoryMemoria } from "./ProdutoRepositoryMemoria";

const produtos: ProdutoEstoque[] = [
  { id: "agua", name: "Água", category: "Bebidas", supplier: "Fornecedor A", unit: "fardos", currentStock: 5, minimumStock: 3 },
  { id: "copo", name: "Copo", category: "Descartáveis", supplier: "Fornecedor B", unit: "pacotes", currentStock: 10, minimumStock: 4 },
];

describe("ProdutoRepositoryMemoria", () => {
  it("lista todos os produtos cadastrados", async () => {
    const repositorio = new ProdutoRepositoryMemoria(produtos);
    const resultado = await repositorio.listar();

    expect(resultado).toHaveLength(2);
    expect(resultado).not.toBeUndefined();
  });

  it("busca um produto existente pelo ID", async () => {
    const repositorio = new ProdutoRepositoryMemoria(produtos);
    await expect(repositorio.buscarPorId("agua")).resolves.toMatchObject({ id: "agua", name: "Água" });
  });

  it("retorna null para um ID inexistente", async () => {
    const repositorio = new ProdutoRepositoryMemoria(produtos);
    await expect(repositorio.buscarPorId("inexistente")).resolves.toBeNull();
  });

  it("atualiza somente o produto informado", async () => {
    const repositorio = new ProdutoRepositoryMemoria(produtos);
    await repositorio.atualizar({ ...produtos[0], currentStock: 8 });
    const resultado = await repositorio.listar();

    expect(resultado.find((produtoAtual) => produtoAtual.id === "agua")?.currentStock).toBe(8);
    expect(resultado.find((produtoAtual) => produtoAtual.id === "copo")?.currentStock).toBe(10);
  });

  it("protege os dados internos contra mutação externa", async () => {
    const repositorio = new ProdutoRepositoryMemoria(produtos);
    const listado = await repositorio.buscarPorId("agua");
    if (!listado) throw new Error("Produto de teste não encontrado.");

    listado.currentStock = 999;
    await expect(repositorio.buscarPorId("agua")).resolves.toMatchObject({ currentStock: 5 });
  });
});
