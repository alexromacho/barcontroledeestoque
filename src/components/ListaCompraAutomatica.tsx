import { useState } from "react";
import { Pencil, Plus, Send, ShoppingBasket, Trash2, X } from "lucide-react";
import { Fornecedor, ItemCompra, ProdutoEstoque } from "../types/estoque";

type ListaCompraAutomaticaProps = {
  fornecedores: Fornecedor[];
  produtos: ProdutoEstoque[];
  itensCompraPorFornecedor: Record<string, ItemCompra[]>;
  onAdicionarManual: (produto: ProdutoEstoque, quantidade: number) => void;
  onEditarItem: (produto: ProdutoEstoque, quantidade: number) => void;
  onRemoverManual: (produtoId: string) => void;
  onEnviarPedido: (fornecedor: Fornecedor, itensCompra: ItemCompra[]) => void;
};

export function ListaCompraAutomatica({
  fornecedores,
  produtos,
  itensCompraPorFornecedor,
  onAdicionarManual,
  onEditarItem,
  onRemoverManual,
  onEnviarPedido,
}: ListaCompraAutomaticaProps) {
  const [produtoManualAbertoId, setProdutoManualAbertoId] = useState<string | null>(null);
  const [quantidadeManual, setQuantidadeManual] = useState("1");

  function pedirQuantidade(label: string, quantidadeAtual = 1) {
    const resposta = window.prompt(label, quantidadeAtual.toString());
    if (resposta === null) return null;

    const quantidade = Number(resposta.replace(",", "."));
    return Number.isFinite(quantidade) && quantidade > 0 ? quantidade : null;
  }

  function abrirAdicionarManual(produto: ProdutoEstoque) {
    setProdutoManualAbertoId(produto.id);
    setQuantidadeManual("1");
  }

  function fecharAdicionarManual() {
    setProdutoManualAbertoId(null);
    setQuantidadeManual("1");
  }

  function confirmarAdicionarManual(produto: ProdutoEstoque) {
    const quantidade = Number(quantidadeManual.replace(",", "."));
    if (!Number.isFinite(quantidade) || quantidade <= 0) return;

    onAdicionarManual(produto, quantidade);
    fecharAdicionarManual();
  }

  function editarItem(item: ItemCompra) {
    const quantidade = pedirQuantidade(`Nova quantidade de ${item.name}`, item.quantityToBuy);
    if (quantidade === null) return;

    onEditarItem(item, quantidade);
  }

  return (
    <article className="teste-panel">
      <div className="teste-panel-heading">
        <div>
          <span className="teste-eyebrow">Seção 3</span>
          <h2>Lista de Compra Automática</h2>
        </div>
        <ShoppingBasket size={24} />
      </div>

      <div className="teste-purchase-groups">
        {fornecedores.map((fornecedor) => {
          const itensCompra = itensCompraPorFornecedor[fornecedor.name] ?? [];
          const produtosFornecedor = produtos.filter((produto) => produto.supplier === fornecedor.name);

          return (
            <section className="teste-purchase-group" key={fornecedor.name}>
              <div className="teste-purchase-group-header">
                <div className="teste-supplier-summary">
                  <strong>{fornecedor.name}</strong>
                  <span>{fornecedor.category}</span>
                  {fornecedor.phone && <span>Telefone: {fornecedor.phone}</span>}
                  <span>Frequência de compra: {fornecedor.purchaseFrequency}</span>
                </div>

                <button type="button" onClick={() => onEnviarPedido(fornecedor, itensCompra)}>
                  <Send size={18} />
                  Enviar pedido no WhatsApp
                </button>
              </div>

              <div className="teste-purchase-list">
                <h3>Lista de compra</h3>
                {itensCompra.length === 0 ? (
                  <p className="teste-empty">Nenhum item na lista de compra.</p>
                ) : (
                  itensCompra.map((item) => (
                    <div className="teste-purchase-item" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {item.origem === "automatico" ? "Origem: automático" : "Origem: manual"}
                          {" · "}
                          Atual {item.currentStock} · mínimo {item.minimumStock}
                        </span>
                      </div>
                      <b>Comprar {item.quantityToBuy} {item.unit}</b>
                      <div className="teste-purchase-actions">
                        <button type="button" onClick={() => editarItem(item)} aria-label={`Editar ${item.name}`}>
                          <Pencil size={16} />
                          Editar
                        </button>
                        {item.quantidadeManual > 0 && (
                          <button
                            className="teste-icon-danger"
                            type="button"
                            onClick={() => onRemoverManual(item.id)}
                            aria-label={`Remover item manual ${item.name}`}
                          >
                            <Trash2 size={16} />
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="teste-supplier-products">
                <h3>Produtos do fornecedor</h3>
                <div className="produtos-fornecedor-scroll">
                  {produtosFornecedor.map((produto) => {
                    const quantityToBuy = Math.max(0, produto.minimumStock - produto.currentStock);
                    const status = quantityToBuy > 0 ? `Comprar ${quantityToBuy} ${produto.unit}` : "OK";

                    return (
                      <div className="teste-supplier-product" key={produto.id}>
                        <div className="teste-supplier-product-main">
                          <div>
                            <strong>{produto.name}</strong>
                            <span>
                              Atual {produto.currentStock} · mínimo {produto.minimumStock} · {produto.unit}
                            </span>
                            <em className={quantityToBuy > 0 ? "is-buy" : "is-ok"}>{status}</em>
                          </div>
                          {produtoManualAbertoId !== produto.id && (
                            <button type="button" onClick={() => abrirAdicionarManual(produto)}>
                              <Plus size={16} />
                              Adicionar à lista
                            </button>
                          )}
                        </div>
                        {produtoManualAbertoId === produto.id && (
                          <div
                            className="teste-manual-add"
                          >
                            <label>
                              Quantidade
                              <input
                                min="1"
                                step="1"
                                type="number"
                                value={quantidadeManual}
                                onChange={(event) => setQuantidadeManual(event.target.value)}
                                autoFocus
                              />
                            </label>
                            <span>{produto.unit}</span>
                            <button type="button" onClick={() => confirmarAdicionarManual(produto)}>
                              <Plus size={16} />
                              Adicionar
                            </button>
                            <button
                              className="teste-manual-cancel"
                              type="button"
                              onClick={fecharAdicionarManual}
                              aria-label={`Cancelar adição de ${produto.name}`}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
