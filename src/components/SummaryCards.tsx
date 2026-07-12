import { ReactNode } from "react";
import { AlertTriangle, Boxes, ClipboardList, PackageCheck } from "lucide-react";

type SummaryCardsProps = {
  produtosCadastrados: number;
  estoqueTotal: number;
  abaixoDoMinimo: number;
  itensParaComprar: number;
};

export function SummaryCards({
  produtosCadastrados,
  estoqueTotal,
  abaixoDoMinimo,
  itensParaComprar,
}: SummaryCardsProps) {
  return (
    <section className="teste-section-block" aria-labelledby="resumo-title">
      <div className="teste-section-title">
        <span className="teste-eyebrow">Dashboard</span>
        <h2 id="resumo-title">Resumo</h2>
      </div>
      <div className="teste-metrics dashboard-summary-grid" aria-label="Indicadores">
        <MetricCard icon={<Boxes />} label="Produtos cadastrados" value={produtosCadastrados.toString()} tone="good" />
        <MetricCard icon={<PackageCheck />} label="Estoque total" value={estoqueTotal.toString()} tone="neutral" />
        <MetricCard icon={<AlertTriangle />} label="Abaixo do mínimo" value={abaixoDoMinimo.toString()} tone="danger" />
        <MetricCard icon={<ClipboardList />} label="Itens para comprar" value={itensParaComprar.toString()} tone="warning" />
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
