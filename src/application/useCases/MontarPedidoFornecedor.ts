import { Fornecedor, ItemCompra } from "../../types/estoque";

export function montarPedidoFornecedor(fornecedor: Fornecedor, itens: ItemCompra[]) {
  return {
    fornecedor,
    itens: itens.filter((item) => item.supplier === fornecedor.name),
  };
}
