import { Menu } from "lucide-react";

type DashboardHeaderProps = {
  currentDateTime: string;
  onOpenMenu: () => void;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function DashboardHeader({
  currentDateTime,
  onOpenMenu,
  eyebrow = "Sistema interno",
  title = "Dashboard de Estoque",
  subtitle = "Visão geral do estoque e controle de saídas",
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <button className="mobile-menu-button" type="button" onClick={onOpenMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>

      <div>
        <span className="teste-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <time className="dashboard-clock" dateTime={new Date().toISOString()}>
        {currentDateTime}
      </time>
    </header>
  );
}
