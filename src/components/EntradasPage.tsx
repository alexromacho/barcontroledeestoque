import { FormEvent, ReactNode, useState } from "react";
import { ClipboardCheck, FileImage, PackagePlus, ReceiptText, Truck } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { Fornecedor, MovimentacaoEstoque, ProdutoEstoque } from "../types/estoque";
import { normalizarTexto } from "../utils/normalizarTexto";

type EntradasPageProps = {
  fornecedores: Fornecedor[];
  produtos: ProdutoEstoque[];
  historicoMovimentacoes: MovimentacaoEstoque[];
  currentDateTime: string;
  onOpenMenu: () => void;
  onRegistrarEntrada: (produtoId: string, quantidade: number) => void;
};

export function EntradasPage({
  fornecedores,
  produtos,
  historicoMovimentacoes,
  currentDateTime,
  onOpenMenu,
  onRegistrarEntrada,
}: EntradasPageProps) {
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(fornecedores[0]?.name ?? "");
  const [buscaProduto, setBuscaProduto] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [produtoRapidoId, setProdutoRapidoId] = useState<string | null>(null);
  const [quantidadeRapida, setQuantidadeRapida] = useState("1");

  const fornecedorAtual = fornecedores.find((fornecedor) => fornecedor.name === fornecedorSelecionado) ?? fornecedores[0];
  const produtosFornecedor = produtos.filter((produto) => produto.supplier === fornecedorAtual?.name);
  const busca = normalizarTexto(buscaProduto);
  const produtosFiltrados = busca
    ? produtosFornecedor.filter((produto) => normalizarTexto(produto.name).includes(busca))
    : produtosFornecedor;

  const valorQuantidade = Number(quantidade);
  const podeRegistrar = Boolean(produtoId) && Number.isFinite(valorQuantidade) && valorQuantidade > 0;

  const hoje = new Date().toLocaleDateString("pt-BR");
  const entradasHoje = historicoMovimentacoes.filter((movimentacao) => movimentacao.tipo === "entrada" && movimentacao.date === hoje);

  function registrarEntrada(event: FormEvent) {
    event.preventDefault();
    if (!podeRegistrar) return;
    onRegistrarEntrada(produtoId, valorQuantidade);
    setProdutoId("");
    setQuantidade("1");
  }

  function selecionarFornecedor(nome: string) {
    setFornecedorSelecionado(nome);
    setProdutoId("");
    setBuscaProduto("");
  }

  function abrirEntradaRapida(produto: ProdutoEstoque) {
    setProdutoRapidoId(produto.id);
    setQuantidadeRapida("1");
  }

  function fecharEntradaRapida() {
    setProdutoRapidoId(null);
    setQuantidadeRapida("1");
  }

  function confirmarEntradaRapida(produto: ProdutoEstoque) {
    const valor = Number(quantidadeRapida);
    if (!Number.isFinite(valor) || valor <= 0) return;
    onRegistrarEntrada(produto.id, valor);
    fecharEntradaRapida();
  }

  return (
    <>
      <DashboardHeader
        currentDateTime={currentDateTime}
        eyebrow="Recebimento"
        title="Entradas de Estoque"
        subtitle="Registre compras recebidas e prepare a conferência de entrada"
        onOpenMenu={onOpenMenu}
      />

      <section className="teste-section-block" aria-labelledby="entradas-resumo-title">
        <div className="teste-section-title">
          <span className="teste-eyebrow">Entradas</span>
          <h2 id="entradas-resumo-title">Resumo do recebimento</h2>
        </div>
        <div className="teste-metrics dashboard-summary-grid" aria-label="Indicadores de entradas">
          <EntradaMetricCard icon={<PackagePlus />} label="Entradas hoje" value={entradasHoje.length.toString()} tone="good" />
          <EntradaMetricCard
            icon={<ClipboardCheck />}
            label="Produtos recebidos"
            value={new Set(entradasHoje.map((movimentacao) => movimentacao.productId)).size.toString()}
            tone="neutral"
          />
          <EntradaMetricCard icon={<Truck />} label="Fornecedores ativos" value={fornecedores.length.toString()} tone="good" />
          <EntradaMetricCard icon={<ReceiptText />} label="Notas pendentes" value="0" tone="warning" />
        </div>
      </section>

      <section className="entradas-grid">
        <article className="teste-panel entradas-form-panel">
          <div className="teste-panel-heading">
            <div>
              <span className="teste-eyebrow">Nova entrada</span>
              <h2>Registrar compra recebida</h2>
            </div>
            <PackagePlus size={24} />
          </div>

          <form className="teste-form" onSubmit={registrarEntrada}>
            <label>
              Fornecedor
              <select value={fornecedorSelecionado} onChange={(event) => selecionarFornecedor(event.target.value)}>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.name} value={fornecedor.name}>
                    {fornecedor.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Buscar produto
              <input
                type="text"
                value={buscaProduto}
                onChange={(event) => setBuscaProduto(event.target.value)}
                placeholder="Buscar produto recebido..."
              />
            </label>

            <div className="teste-search-results" aria-label="Produtos filtrados">
              {produtosFiltrados.length === 0 ? (
                <p className="teste-empty">Nenhum produto encontrado.</p>
              ) : (
                produtosFiltrados.slice(0, 8).map((produto) => (
                  <button
                    className={produto.id === produtoId ? "teste-search-result is-selected" : "teste-search-result"}
                    key={produto.id}
                    type="button"
                    onClick={() => setProdutoId(produto.id)}
                  >
                    <span>{produto.name}</span>
                    <small>Atual {produto.currentStock} · mínimo {produto.minimumStock}</small>
                  </button>
                ))
              )}
            </div>

            <label>
              Produto
              <select value={produtoId} onChange={(event) => setProdutoId(event.target.value)}>
                <option value="">Selecione o produto recebido</option>
                {produtosFiltrados.slice(0, 12).map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.name} · atual {produto.currentStock} · mínimo {produto.minimumStock}
                  </option>
                ))}
              </select>
            </label>

            <div className="teste-form-row">
              <label>
                Quantidade recebida
                <input
                  min="1"
                  step="1"
                  type="number"
                  value={quantidade}
                  onChange={(event) => setQuantidade(event.target.value)}
                />
              </label>
              <div className="teste-unit-card">
                <span>Unidade</span>
                <strong>automática</strong>
              </div>
            </div>

            <label>
              Observação
              <input type="text" placeholder="Ex.: compra semanal, nota 1234" />
            </label>

            <button type="submit" disabled={!podeRegistrar}>
              Registrar entrada
            </button>
          </form>
        </article>

        <article className="teste-panel entradas-products-panel">
          <div className="teste-panel-heading">
            <div>
              <span className="teste-eyebrow">Conferência</span>
              <h2>Produtos do fornecedor</h2>
            </div>
            <Truck size={24} />
          </div>

          <div className="entradas-supplier-card">
            <strong>{fornecedorAtual?.name}</strong>
            <span>{fornecedorAtual?.category}</span>
          </div>

          <div className="produtos-fornecedor-scroll">
            {produtosFornecedor.map((produto) => (
              <div className="teste-supplier-product" key={produto.id}>
                <div className="teste-supplier-product-main">
                  <div>
                    <strong>{produto.name}</strong>
                    <span>
                      Atual {produto.currentStock} · mínimo {produto.minimumStock} · {produto.unit}
                    </span>
                    <em className="is-ok">Receber</em>
                  </div>
                  {produtoRapidoId !== produto.id && (
                    <button type="button" onClick={() => abrirEntradaRapida(produto)}>
                      Adicionar entrada
                    </button>
                  )}
                </div>
                {produtoRapidoId === produto.id && (
                  <div className="teste-manual-add">
                    <label>
                      Quantidade
                      <input
                        min="1"
                        step="1"
                        type="number"
                        value={quantidadeRapida}
                        onChange={(event) => setQuantidadeRapida(event.target.value)}
                        autoFocus
                      />
                    </label>
                    <span>{produto.unit}</span>
                    <button type="button" onClick={() => confirmarEntradaRapida(produto)}>
                      Registrar
                    </button>
                    <button
                      className="teste-manual-cancel"
                      type="button"
                      onClick={fecharEntradaRapida}
                      aria-label={`Cancelar entrada de ${produto.name}`}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="teste-panel entradas-future-panel" aria-labelledby="entrada-nota-title">
        <div className="teste-panel-heading">
          <div>
            <span className="teste-eyebrow">Futuro</span>
            <h2 id="entrada-nota-title">Entrada por nota fiscal</h2>
          </div>
          <FileImage size={24} />
        </div>
        <p>Recurso futuro. Exigirá armazenamento, Supabase e serviço de IA.</p>
        <div className="teste-future-actions">
          <button type="button" disabled>Fotografar nota</button>
          <button type="button" disabled>Anexar imagem</button>
          <button type="button" disabled>Conferir produtos</button>
        </div>
      </section>

      <section className="teste-panel">
        <div className="teste-panel-heading">
          <div>
            <span className="teste-eyebrow">Histórico</span>
            <h2>Histórico de Entradas</h2>
          </div>
        </div>
        <div className="teste-table-wrap">
          <table className="teste-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Horário</th>
                <th>Produto</th>
                <th>Fornecedor</th>
                <th>Quantidade</th>
                <th>Unidade</th>
                <th>Estoque anterior</th>
                <th>Estoque atual</th>
              </tr>
            </thead>
            <tbody>
              {entradasHoje.length === 0 ? (
                <tr>
                  <td colSpan={8}>Nenhuma entrada registrada hoje.</td>
                </tr>
              ) : (
                entradasHoje.map((movimentacao) => (
                  <tr key={movimentacao.id}>
                    <td>{movimentacao.date}</td>
                    <td>{movimentacao.time}</td>
                    <td>{movimentacao.productName}</td>
                    <td>{movimentacao.supplier}</td>
                    <td>{movimentacao.quantity}</td>
                    <td>{movimentacao.unit}</td>
                    <td>{movimentacao.previousStock}</td>
                    <td>{movimentacao.currentStock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function EntradaMetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "danger" | "warning" | "good" | "neutral";
}) {
  return (
    <article className={`teste-metric ${tone}`}>
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
