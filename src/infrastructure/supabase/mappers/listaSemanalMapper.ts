import type { ListaSemanalRegistro } from "../../../types/estoque";
import type { WeeklyListComItensRow } from "../database.types";

export function mapListaSemanalRowToDomain(row: WeeklyListComItensRow): ListaSemanalRegistro {
  const data = new Date(row.created_at);
  const porFornecedor = new Map<string, ListaSemanalRegistro["fornecedores"][number]>();

  row.weekly_list_items.forEach((item) => {
    const nomeFornecedor = item.suppliers?.name ?? "Fornecedor não identificado";
    const grupo = porFornecedor.get(nomeFornecedor) ?? { name: nomeFornecedor, itens: [] };
    grupo.itens.push({
      name: item.product_name,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unit_price,
    });
    porFornecedor.set(nomeFornecedor, grupo);
  });

  return {
    id: row.id,
    createdAt: row.created_at,
    date: data.toLocaleDateString("pt-BR"),
    time: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    fornecedores: Array.from(porFornecedor.values()),
  };
}
