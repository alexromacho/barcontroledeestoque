import {
  BarChart3,
  Boxes,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBasket,
  Truck,
  X,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Estoque", icon: Boxes },
  { label: "Saídas", icon: LogOut },
  { label: "Histórico", icon: History },
  { label: "Lista de Compra", icon: ShoppingBasket },
  { label: "Fornecedores", icon: Truck },
  { label: "Relatórios", icon: BarChart3 },
  { label: "Configurações", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
        {sidebarLinks.map(({ label, icon: Icon, active }) => (
          <a className={active ? "sidebar-link active" : "sidebar-link"} href="#" key={label}>
            <Icon size={18} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
