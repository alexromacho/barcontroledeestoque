import type { MovimentacaoEstoque } from "../entities/MovimentacaoEstoque";

export interface MovimentacaoRepository {
  registrar(movimentacao: MovimentacaoEstoque): Promise<void>;
  listarPorData(data: string): Promise<MovimentacaoEstoque[]>;
}
