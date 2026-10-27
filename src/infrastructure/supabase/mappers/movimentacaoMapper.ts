import type { MovimentacaoEstoque } from "../../../domain/entities/MovimentacaoEstoque";
import type { MovimentacaoComRelacoesRow, MovimentacaoInsert } from "../database.types";

export function mapMovimentacaoRowToDomain(row: MovimentacaoComRelacoesRow): MovimentacaoEstoque {
  if (!row.products || !row.products.suppliers) {
    throw new Error(`Relações não encontradas para a movimentação ${row.id}.`);
  }
  if (row.movement_type === "ajuste") {
    throw new Error(`Movimentação ${row.id}: tipo "ajuste" ainda não é suportado no domínio.`);
  }

  const data = new Date(row.created_at);

  return {
    id: row.id,
    productId: row.product_id,
    tipo: row.movement_type,
    date: data.toLocaleDateString("pt-BR"),
    time: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    productName: row.products.name,
    category: row.products.category,
    quantity: row.quantity,
    unit: row.products.unit,
    previousStock: row.previous_stock,
    currentStock: row.current_stock,
    supplier: row.products.suppliers.name,
  };
}

export function mapMovimentacaoDomainToInsert(movimentacao: MovimentacaoEstoque): MovimentacaoInsert {
  return {
    product_id: movimentacao.productId,
    movement_type: movimentacao.tipo,
    quantity: movimentacao.quantity,
    previous_stock: movimentacao.previousStock,
    current_stock: movimentacao.currentStock,
    note: "",
    invoice_image_path: null,
  };
}
