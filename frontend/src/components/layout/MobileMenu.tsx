import { NavLink } from 'react-router-dom';

const ALL_GROUPS = [
  {
    title: "📐 Matemática",
    items: [
      { to: "/matematica/basico",      icon: "calculate",     label: "Básica" },
      { to: "/matematica/cientifico",  icon: "science",       label: "Científica" },
      { to: "/matematica/algebra",     icon: "superscript",   label: "Álgebra & Eq." },
      { to: "/matematica/calculo",     icon: "functions",     label: "Cálculo Dif." },
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

export function MobileMenu() {
  return (
    <div className="flex flex-col h-full w-full pb-24 overflow-y-auto custom-scrollbar">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-[28px] text-[var(--color-text-primary)] leading-none">Todos os Módulos</h2>
          <p className="font-mono-code text-[var(--font-size-small)] text-[var(--color-primary)] mt-1 uppercase tracking-widest opacity-80">
            Engineering Toolkit
          </p>
        </div>
        <span className="material-symbols-outlined text-[36px] text-[var(--color-primary)] opacity-50">apps</span>
      </div>

      <div className="flex flex-col gap-8">
        {ALL_GROUPS.map((group, i) => (
          <div key={i} className="flex flex-col gap-3">
            <h3 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border)] pb-2">
              {group.title}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border ${
                      isActive
                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[32px] mb-2">{item.icon}</span>
                  <span className="font-label-caps text-[11px] uppercase text-center leading-tight">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
