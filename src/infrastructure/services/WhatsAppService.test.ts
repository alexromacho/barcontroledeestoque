import { describe, expect, it } from "vitest";
import type { Fornecedor, ItemCompra } from "../../types/estoque";
import { criarUrlPedidoWhatsApp, montarMensagemPedido } from "./WhatsAppService";

const fornecedor: Fornecedor = {
  name: "Fornecedor Teste",
  phone: "5514999999999",
  category: "Bebidas",
  purchaseFrequency: "Semanal",
};

const itens: ItemCompra[] = [
  {
    id: "agua",
    name: "Água sem gás",
    category: "Água",
    supplier: fornecedor.name,
    unit: "fardos",
    currentStock: 4,
    minimumStock: 10,
    quantityToBuy: 6,
    origem: "automatico",
    quantidadeAutomatica: 6,
    quantidadeManual: 0,
  },
  {
    id: "gelo",
    name: "Gelo",
    category: "Bebidas",
    supplier: fornecedor.name,
    unit: "sacos",
    currentStock: 0,
    minimumStock: 2,
    quantityToBuy: 2,
    origem: "automatico",
    quantidadeAutomatica: 2,
    quantidadeManual: 0,
  },
];

describe("WhatsAppService", () => {
  it("gera uma mensagem legível com produtos, quantidades e unidades", () => {
    const mensagem = montarMensagemPedido(fornecedor, itens);

    expect(mensagem).toContain(`Olá, ${fornecedor.name}. Boa tarde!`);
    expect(mensagem).toContain("6 fardos de Água sem gás");
    expect(mensagem).toContain("2 sacos de Gelo");
    expect(mensagem).not.toContain("undefined");
  });

  it("não duplica itens na mensagem", () => {
    const mensagem = montarMensagemPedido(fornecedor, itens);

    expect(mensagem.match(/Água sem gás/g)).toHaveLength(1);
    expect(mensagem.match(/Gelo/g)).toHaveLength(1);
  });

  it("gera a URL para o telefone correto com a mensagem codificada", () => {
    const url = criarUrlPedidoWhatsApp(fornecedor, itens);

    expect(url).toContain(`https://wa.me/${fornecedor.phone}?text=`);
    expect(decodeURIComponent(url)).toContain("6 fardos de Água sem gás");
    expect(url).not.toContain("undefined");
  });
});
