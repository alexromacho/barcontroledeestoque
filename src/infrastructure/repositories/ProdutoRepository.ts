import { ProdutoEstoque } from "../../types/estoque";

export interface ProdutoRepository {
  listar(): Promise<ProdutoEstoque[]>;
  buscarPorId(id: string): Promise<ProdutoEstoque | null>;
  atualizar(produto: ProdutoEstoque): Promise<void>;
}
