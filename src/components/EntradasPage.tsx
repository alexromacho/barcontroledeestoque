import { ReactNode } from "react";
import { ClipboardCheck, FileImage, PackagePlus, ReceiptText, Truck } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { Fornecedor, ProdutoEstoque } from "../types/estoque";

type EntradasPageProps = {
  fornecedores: Fornecedor[];
  produtos: ProdutoEstoque[];
  currentDateTime: string;
  onOpenMenu: () => void;
};

export function EntradasPage({
  fornecedores,
  produtos,
  currentDateTime,
  onOpenMenu,
}: EntradasPageProps) {
  const fornecedorPrincipal = fornecedores[0];
  const produtosFornecedor = produtos.filter((produto) => produto.supplier === fornecedorPrincipal?.name);

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
          <EntradaMetricCard icon={<PackagePlus />} label="Entradas hoje" value="0" tone="good" />
          <EntradaMetricCard icon={<ClipboardCheck />} label="Produtos recebidos" value="0" tone="neutral" />
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

          <form className="teste-form">
            <label>
              Fornecedor
              <select defaultValue={fornecedorPrincipal?.name ?? ""}>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.name} value={fornecedor.name}>
                    {fornecedor.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Buscar produto
              <input type="text" placeholder="Buscar produto recebido..." />
            </label>

            <label>
              Produto
              <select defaultValue="">
                <option value="">Selecione o produto recebido</option>
                {produtosFornecedor.slice(0, 12).map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.name} · atual {produto.currentStock} · mínimo {produto.minimumStock}
                  </option>
                ))}
              </select>
            </label>

            <div className="teste-form-row">
              <label>
                Quantidade recebida
                <input min="1" step="1" type="number" placeholder="0" />
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

            <button type="button" disabled>
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
            <strong>{fornecedorPrincipal?.name}</strong>
            <span>{fornecedorPrincipal?.category}</span>
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
                  <button type="button" disabled>
                    Adicionar entrada
                  </button>
                </div>
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
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9}>Nenhuma entrada registrada hoje.</td>
              </tr>
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
