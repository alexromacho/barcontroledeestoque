import type { MovimentacaoEstoque } from "../entities/MovimentacaoEstoque";

export interface MovimentacaoRepository {
  listar(): Promise<MovimentacaoEstoque[]>;
  registrar(movimentacao: MovimentacaoEstoque): Promise<void>;
}
