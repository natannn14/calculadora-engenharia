import { NavLink } from 'react-router-dom';

const BOTTOM_ITEMS = [
  { to: "/matematica/basico",  icon: "calculate", label: "Básica" },
  { to: "/matematica/calculo", icon: "integration_instructions", label: "Cálculo" },
  { to: "/engenharia/vigas",   icon: "schema",    label: "Vigas" },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[var(--color-surface)] border-t border-[var(--color-border)] z-50 flex items-center justify-around px-[var(--spacing-sm)]">
      {BOTTOM_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`
          }
        >
          <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
          <span className="text-[10px] font-label-caps uppercase">{item.label}</span>
        </NavLink>
      ))}
      <NavLink
        to="/menu"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`
        }
      >
        <span className="material-symbols-outlined text-[24px]">apps</span>
        <span className="text-[10px] font-label-caps uppercase">Menu</span>
      </NavLink>
    </nav>
  );
}