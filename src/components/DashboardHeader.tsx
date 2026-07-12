import { Menu } from "lucide-react";

type DashboardHeaderProps = {
  currentDateTime: string;
  onOpenMenu: () => void;
};

export function DashboardHeader({ currentDateTime, onOpenMenu }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <button className="mobile-menu-button" type="button" onClick={onOpenMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>

      <div>
        <span className="teste-eyebrow">Sistema interno</span>
        <h1>Dashboard de Estoque</h1>
        <p>Visão geral do estoque e controle de saídas</p>
      </div>

      <time className="dashboard-clock" dateTime={new Date().toISOString()}>
        {currentDateTime}
      </time>
    </header>
  );
}
