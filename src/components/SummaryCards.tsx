import { ReactNode } from "react";
import { AlertTriangle, ArrowDownCircle, Boxes, ClipboardList, Truck } from "lucide-react";

type SummaryCardsProps = {
  produtosCadastrados: number;
  abaixoDoMinimo: number;
  saidasHoje: number;
  itensParaComprar: number;
  fornecedoresAtivos: number;
};

export function SummaryCards({
  produtosCadastrados,
  abaixoDoMinimo,
  saidasHoje,
  itensParaComprar,
  fornecedoresAtivos,
}: SummaryCardsProps) {
  return (
    <section className="teste-section-block" aria-labelledby="resumo-title">
      <div className="teste-section-title">
        <span className="teste-eyebrow">Dashboard</span>
        <h2 id="resumo-title">Resumo</h2>
      </div>
      <div className="teste-metrics dashboard-summary-grid" aria-label="Indicadores">
        <MetricCard icon={<Boxes />} label="Produtos cadastrados" value={produtosCadastrados.toString()} tone="good" />
        <MetricCard icon={<AlertTriangle />} label="Abaixo do mínimo" value={abaixoDoMinimo.toString()} tone="danger" />
        <MetricCard icon={<ArrowDownCircle />} label="Saídas registradas hoje" value={saidasHoje.toString()} tone="neutral" />
        <MetricCard icon={<ClipboardList />} label="Itens para comprar" value={itensParaComprar.toString()} tone="warning" />
        <MetricCard icon={<Truck />} label="Fornecedores ativos" value={fornecedoresAtivos.toString()} tone="good" />
      </div>
    </section>
  );
}

function MetricCard({
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
