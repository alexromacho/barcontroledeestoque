import { ItemCompra } from "../types/estoque";

export function criarMensagemPedido(itens: ItemCompra[]) {
  const linhasPedido = itens.length > 0
    ? itens.map((item) => `- ${item.quantityToBuy} ${item.unit} de ${item.name}`).join("\n")
    : "- Nenhum item abaixo do mínimo no momento.";

  return `Olá, tudo bem? Boa tarde, preciso de:\n\n${linhasPedido}\n\nObrigado.`;
}

export function criarUrlWhatsApp(telefone: string, mensagem: string) {
  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}
