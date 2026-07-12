import { useState } from "react";
import { Clipboard, Download, Pencil, Plus, Send, ShoppingBasket, Trash2, X } from "lucide-react";
import { Fornecedor, ItemCompra, ListaSemanalRegistro, ProdutoEstoque } from "../types/estoque";

type ListaCompraAutomaticaProps = {
  fornecedores: Fornecedor[];
  produtos: ProdutoEstoque[];
  itensCompraPorFornecedor: Record<string, ItemCompra[]>;
  historicoListas: ListaSemanalRegistro[];
  onAdicionarManual: (produto: ProdutoEstoque, quantidade: number) => void;
  onEditarItem: (produto: ProdutoEstoque, quantidade: number) => void;
  onRemoverManual: (produtoId: string) => void;
  onEnviarPedido: (fornecedor: Fornecedor, itens: ItemCompra[]) => void;
  onGerarListaSemanal: () => string;
  onLimparListaSemanal: () => void;
};

export function ListaCompraAutomatica({
  fornecedores,
  produtos,
  itensCompraPorFornecedor,
  historicoListas,
  onAdicionarManual,
  onEditarItem,
  onRemoverManual,
  onEnviarPedido,
  onGerarListaSemanal,
  onLimparListaSemanal,
}: ListaCompraAutomaticaProps) {
  const [produtoManualAbertoId, setProdutoManualAbertoId] = useState<string | null>(null);
  const [quantidadeManual, setQuantidadeManual] = useState("1");
  const [listaSemanal, setListaSemanal] = useState("");

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

  const quantidadeFornecedoresComPedido = fornecedores.filter(
    (fornecedor) => (itensCompraPorFornecedor[fornecedor.name] ?? []).length > 0,
  ).length;
  const mesAtual = new Date().toISOString().slice(0, 7);
  const totalDoMes = historicoListas
    .filter((registro) => registro.createdAt.slice(0, 7) === mesAtual)
    .reduce((total, registro) => total + registro.fornecedores.reduce(
      (subtotal, fornecedor) => subtotal + fornecedor.itens.reduce(
        (valor, item) => valor + item.quantity * item.unitPrice, 0,
      ), 0,
    ), 0);
  const formatarValor = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function gerarListaSemanal() {
    const conteudo = onGerarListaSemanal();
    if (!conteudo) return;
    setListaSemanal(conteudo);

    const arquivo = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lista-da-semana.txt";
    link.click();
    URL.revokeObjectURL(url);
    setListaSemanal("");
    onLimparListaSemanal();
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

      <div className="teste-whatsapp-geral">
        <div>
          <strong>LISTA DA SEMANA</strong>
          <span>
            Gere um bloco de notas com os itens de {quantidadeFornecedoresComPedido}{" "}
            {quantidadeFornecedoresComPedido === 1 ? "fornecedor" : "fornecedores"}.
          </span>
        </div>
        <button
          type="button"
          disabled={quantidadeFornecedoresComPedido === 0}
          onClick={gerarListaSemanal}
        >
          <Download size={18} />
          Gerar lista da semana
        </button>
      </div>

      {listaSemanal && (
        <div className="lista-semanal-preview">
          <div>
            <strong>Prévia da lista</strong>
            <button type="button" onClick={() => navigator.clipboard.writeText(listaSemanal)}>
              <Clipboard size={16} /> Copiar
            </button>
          </div>
          <textarea readOnly rows={12} value={listaSemanal} aria-label="Lista da semana" />
        </div>
      )}

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

                <button
                  type="button"
                  disabled={itensCompra.length === 0}
                  onClick={() => onEnviarPedido(fornecedor, itensCompra)}
                >
                  <Send size={18} />
                  Enviar para {fornecedor.name}
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
                      <b>
                        Comprar {item.quantityToBuy} {item.unit}
                        {" · "}{formatarValor(item.quantityToBuy * (item.unitPrice ?? 0))}
                      </b>
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

      <section className="historico-listas-semana" aria-labelledby="historico-listas-title">
        <div className="teste-panel-heading">
          <div>
            <span className="teste-eyebrow">Registros</span>
            <h2 id="historico-listas-title">Histórico de Listas da Semana</h2>
          </div>
          <div className="historico-total-mes"><span>Total do mês</span><strong>{formatarValor(totalDoMes)}</strong></div>
        </div>
        {historicoListas.length === 0 ? (
          <p className="teste-empty">Nenhuma lista da semana foi gerada.</p>
        ) : (
          <div className="historico-listas-grid">
            {historicoListas.map((registro) => {
              const totalSemana = registro.fornecedores.reduce((total, fornecedor) => total + fornecedor.itens.reduce((subtotal, item) => subtotal + item.quantity * item.unitPrice, 0), 0);
              return (
              <article className="historico-lista-card" key={registro.id}>
                <header><strong>LISTA DA SEMANA · {formatarValor(totalSemana)}</strong><span>{registro.date} · {registro.time}</span></header>
                {registro.fornecedores.map((fornecedor) => (
                  <div className="historico-lista-fornecedor" key={fornecedor.name}>
                    <strong>{fornecedor.name} · {formatarValor(fornecedor.itens.reduce((total, item) => total + item.quantity * item.unitPrice, 0))}</strong>
                    <ul>
                      {fornecedor.itens.map((item, indice) => (
                        <li key={`${item.name}-${indice}`}>{item.quantity} {item.unit} de {item.name} — {formatarValor(item.quantity * item.unitPrice)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </article>
              );
            })}
          </div>
        )}
      </section>
    </article>
  );
}
