import {
  BarChart3,
  Boxes,
  ClipboardList,
  History,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBasket,
  Truck,
  X,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  activePage: "dashboard" | "entradas" | "fornecedores";
  onNavigate: (page: "dashboard" | "entradas" | "fornecedores") => void;
  onClose: () => void;
  onLogout: () => void;
};

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" as const },
  { label: "Estoque", icon: Boxes },
  { label: "Saídas", icon: LogOut },
  { label: "Entradas", icon: Inbox, page: "entradas" as const },
  { label: "Histórico", icon: History },
  { label: "Lista de Compra", icon: ShoppingBasket },
  { label: "Fornecedores", icon: Truck, page: "fornecedores" as const },
  { label: "Relatórios", icon: BarChart3 },
  { label: "Configurações", icon: Settings },
];

export function Sidebar({ isOpen, activePage, onNavigate, onClose, onLogout }: SidebarProps) {
  return (
    <aside className={isOpen ? "sidebar is-open" : "sidebar"} aria-label="Menu principal">
      <button className="sidebar-close" type="button" onClick={onClose} aria-label="Fechar menu">
        <X size={20} />
      </button>

      <div className="sidebar-brand">
        <img
          src="/logo-bar-portugues.jpeg"
          alt="Logo Bar do Português"
          className="sidebar-logo"
        />
        <div className="sidebar-title">Bar do Português</div>
        <div className="sidebar-location">Bauru - SP</div>
      </div>

      <nav className="sidebar-nav" aria-label="Seções do dashboard">
        {sidebarLinks.map(({ label, icon: Icon, page }) => (
          <button
            className={page === activePage ? "sidebar-link active" : "sidebar-link"}
            key={label}
            type="button"
            onClick={() => {
              if (page) {
                onNavigate(page);
                onClose();
              }
            }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="sidebar-link sidebar-logout" type="button" onClick={onLogout}>
        <LogOut size={18} /><span>Sair do sistema</span>
      </button>
    </aside>
  );
}
