import { NavLink } from 'react-router-dom';

interface NavItem { to: string; icon: string; label: string; }
interface NavGroup { title: string; items: NavItem[]; }

const NAV_GROUPS: NavGroup[] = [
  {
    title: "📐 Matemática",
    items: [
      { to: "/matematica/basico",      icon: "calculate",     label: "Básica" },
      { to: "/matematica/cientifico",  icon: "science",       label: "Científica" },
      { to: "/matematica/algebra",     icon: "superscript",   label: "Álgebra & Eq." },
      { to: "/matematica/calculo",     icon: "integration_instructions", label: "Cálculo Dif." },
      { to: "/matematica/matrizes",    icon: "grid_4x4",     label: "Matrizes" },
      { to: "/matematica/complexos",   icon: "all_inclusive", label: "Complexos" },
      { to: "/matematica/estatistica", icon: "bar_chart",     label: "Estatística" },
    ]
  },
  {
    title: "⚛️ Física",
    items: [
      { to: "/fisica", icon: "bolt", label: "Física (em breve)" },
    ]
  },
  {
    title: "🏗️ Engenharia",
    items: [
      { to: "/engenharia/vigas", icon: "schema", label: "Vigas & Cargas" },
    ]
  },
  {
    title: "Recursos",
    items: [
      { to: "/biblioteca",    icon: "menu_book", label: "Biblioteca" },
      { to: "/ferramentas",   icon: "build",     label: "Ferramentas" },
      { to: "/configuracoes", icon: "settings",   label: "Configurações" },
    ]
  }
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-full border-r border-[var(--color-border)] bg-[var(--color-surface)] z-50 flex-shrink-0">
      {/* Logo */}
      <NavLink to="/" className="p-[var(--spacing-lg)] flex items-center gap-[var(--spacing-sm)] border-b border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors">
        <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-black shadow-lg flex-shrink-0">
          <span className="material-symbols-outlined text-[22px] font-bold">memory</span>
        </div>
        <div>
          <span className="font-display font-semibold text-lg tracking-tight text-[var(--color-text-primary)] block leading-none">CalculaEng</span>
          <span className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-mono-code opacity-80">Engineering Toolkit</span>
        </div>
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 px-[var(--spacing-md)] py-[var(--spacing-lg)] space-y-[var(--spacing-md)] overflow-y-auto custom-scrollbar">
        {NAV_GROUPS.map((group, i) => (
          <div key={i} className="space-y-[var(--spacing-xs)]">
            <div className="mb-[var(--spacing-xs)] px-[var(--spacing-xs)]">
              <span className="text-[var(--font-size-caption)] text-[var(--color-text-muted)] font-label-caps uppercase tracking-widest">{group.title}</span>
            </div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[var(--font-size-small)] font-label-caps font-medium transition-all duration-150 relative border ${
                    isActive
                      ? 'bg-[var(--color-surface-elevated)] text-[var(--color-primary)] border-[var(--color-border)] shadow-[inset_2px_0_0_var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}