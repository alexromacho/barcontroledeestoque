import type { MovimentacaoEstoque } from "../../domain/entities/MovimentacaoEstoque";
import type { MovimentacaoRepository } from "../../domain/repositories/MovimentacaoRepository";

export class MovimentacaoRepositoryMemoria implements MovimentacaoRepository {
  private movimentacoes: MovimentacaoEstoque[];

  constructor(movimentacoesIniciais: MovimentacaoEstoque[] = []) {
    this.movimentacoes = movimentacoesIniciais.map((movimentacao) => ({ ...movimentacao }));
  }

  async listar() {
    return this.movimentacoes.map((movimentacao) => ({ ...movimentacao }));
  }

  async registrar(movimentacao: MovimentacaoEstoque) {
    this.movimentacoes = [{ ...movimentacao }, ...this.movimentacoes];
  }
}
