import { ProdutoEstoque } from "../../types/estoque";

export interface ProdutoRepository {
  listar(): Promise<ProdutoEstoque[]>;
  buscarPorId(id: string): Promise<ProdutoEstoque | null>;
  criar(produto: Omit<ProdutoEstoque, "id">): Promise<ProdutoEstoque>;
  atualizar(produto: ProdutoEstoque): Promise<void>;
  excluir(id: string): Promise<void>;
}
