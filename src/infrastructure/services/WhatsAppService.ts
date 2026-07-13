import { Fornecedor, ItemCompra } from "../../types/estoque";
import { criarMensagemPedido, criarUrlWhatsApp } from "../../utils/whatsapp";

export function montarMensagemPedido(fornecedor: Fornecedor, itens: ItemCompra[]) {
  return criarMensagemPedido(itens, fornecedor);
}

export function criarUrlPedidoWhatsApp(fornecedor: Fornecedor, itens: ItemCompra[]) {
  return criarUrlWhatsApp(fornecedor.phone, montarMensagemPedido(fornecedor, itens));
}

export function abrirPedidoWhatsApp(fornecedor: Fornecedor, itens: ItemCompra[]) {
  window.open(criarUrlPedidoWhatsApp(fornecedor, itens), "_blank");
}
