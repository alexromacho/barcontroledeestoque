import { ProdutoEstoque } from "../../types/estoque";
import { ProdutoRepository } from "./ProdutoRepository";

export class ProdutoRepositoryMemoria implements ProdutoRepository {
  private produtos: ProdutoEstoque[];

  constructor(produtosIniciais: ProdutoEstoque[]) {
    this.produtos = produtosIniciais.map((produto) => ({ ...produto }));
  }

  async listar() {
    return this.produtos.map((produto) => ({ ...produto }));
  }

  async buscarPorId(id: string) {
    const produto = this.produtos.find((item) => item.id === id);
    return produto ? { ...produto } : null;
  }

  async criar(produto: Omit<ProdutoEstoque, "id">) {
    const novoProduto: ProdutoEstoque = { ...produto, id: crypto.randomUUID() };
    this.produtos = [...this.produtos, novoProduto];
    return { ...novoProduto };
  }

  async atualizar(produtoAtualizado: ProdutoEstoque) {
    this.produtos = this.produtos.map((produto) =>
      produto.id === produtoAtualizado.id ? { ...produtoAtualizado } : produto,
    );
  }

  async excluir(id: string) {
    this.produtos = this.produtos.filter((produto) => produto.id !== id);
  }
}
