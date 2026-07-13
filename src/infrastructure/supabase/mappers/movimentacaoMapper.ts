import type { MovimentacaoEstoque } from "../../../domain/entities/MovimentacaoEstoque";
import type { MovimentacaoComRelacoesRow, MovimentacaoInsert } from "../database.types";

export function mapMovimentacaoRowToDomain(row: MovimentacaoComRelacoesRow): MovimentacaoEstoque {
  if (!row.produtos || !row.fornecedores) {
    throw new Error(`Relações não encontradas para a movimentação ${row.id}.`);
  }

  return {
    id: row.id,
    tipo: row.tipo,
    date: row.data_movimentacao,
    time: row.horario_movimentacao,
    productName: row.produtos.nome,
    category: row.produtos.categoria,
    quantity: row.quantidade,
    unit: row.unidade,
    previousStock: row.estoque_anterior,
    currentStock: row.estoque_atual,
    supplier: row.fornecedores.nome,
  };
}

export function mapMovimentacaoDomainToInsert(
  movimentacao: MovimentacaoEstoque,
  produtoId: string,
  fornecedorId: string,
): MovimentacaoInsert {
  return {
    id: movimentacao.id,
    produto_id: produtoId,
    fornecedor_id: fornecedorId,
    tipo: movimentacao.tipo,
    quantidade: movimentacao.quantity,
    unidade: movimentacao.unit,
    estoque_anterior: movimentacao.previousStock,
    estoque_atual: movimentacao.currentStock,
    data_movimentacao: movimentacao.date,
    horario_movimentacao: movimentacao.time,
  };
}
