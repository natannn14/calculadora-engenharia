import { NavLink } from 'react-router-dom';

const MODULE_CARDS = [
  {
    title: "Matemática",
    icon: "calculate",
    color: "var(--color-primary)",
    description: "Cálculo, Álgebra, Estatística, Complexos e Matrizes",
    to: "/matematica/basico",
    count: 7,
  },
  {
    title: "Física",
    icon: "bolt",
    color: "#f59e0b",
    description: "Mecânica, Termodinâmica, Eletromagnetismo",
    to: "/fisica",
    count: 0,
    comingSoon: true,
  },
  {
    title: "Engenharia",
    icon: "engineering",
    color: "#3b82f6",
    description: "Estruturas, Vigas, Resistência dos Materiais",
    to: "/engenharia/vigas",
    count: 1,
  },
  {
    title: "Ferramentas",
    icon: "build",
    color: "#a78bfa",
    description: "Conversor de Unidades, Memorial Descritivo",
    to: "/ferramentas",
    count: 0,
    comingSoon: true,
  },
  {
    title: "Biblioteca",
    icon: "menu_book",
    color: "#f472b6",
    description: "Fórmulas, Constantes, Materiais e Normas",
    to: "/biblioteca",
    count: null,
  },
];

const QUICK_ACCESS = [
  { to: "/matematica/basico",      icon: "calculate",     label: "Básica" },
  { to: "/matematica/cientifico",  icon: "science",       label: "Científica" },
  { to: "/matematica/calculo",     icon: "functions",     label: "Cálculo" },
  { to: "/matematica/algebra",     icon: "superscript",   label: "Álgebra" },
  { to: "/matematica/matrizes",    icon: "grid_4x4",     label: "Matrizes" },
  { to: "/matematica/complexos",   icon: "all_inclusive", label: "Complexos" },
  { to: "/matematica/estatistica", icon: "bar_chart",     label: "Estatística" },
  { to: "/engenharia/vigas",       icon: "schema",        label: "Vigas" },
];

export function HomePage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-2">
      {/* Hero */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[clamp(28px,5vw,42px)] text-[var(--color-text-primary)] leading-none tracking-tight">
          Calcula<span className="text-[var(--color-primary)]">Eng</span>
        </h1>
        <p className="font-body-md text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
          Plataforma acadêmica de engenharia. Ferramentas técnicas com embasamento científico, referências normativas e explicações passo a passo.
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono-code uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full border border-[var(--color-primary)]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
            v0.1 · 8 engines ativos
          </span>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULE_CARDS.map((card) => (
          <NavLink
            key={card.to}
            to={card.to}
            className="group relative flex flex-col gap-3 p-5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[28px]" style={{ color: card.color }}>{card.icon}</span>
              {card.comingSoon && (
                <span className="text-[9px] font-mono-code uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                  Em breve
                </span>
              )}
              {card.count !== null && card.count > 0 && (
                <span className="text-[11px] font-mono-code text-[var(--color-text-muted)]">
                  {card.count} {card.count === 1 ? 'engine' : 'engines'}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-display font-semibold text-[var(--font-size-h3)] text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                {card.title}
              </h3>
              <p className="text-[var(--font-size-small)] text-[var(--color-text-muted)] mt-1 leading-snug">
                {card.description}
              </p>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
          Acesso Rápido — Todas as Calculadoras
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_ACCESS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-3 rounded-lg border transition-all duration-200 text-[var(--font-size-small)] font-label-caps ${
                  isActive
                    ? 'bg-[var(--color-surface-elevated)] text-[var(--color-primary)] border-[var(--color-primary)]/30'
                    : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)]'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className="bg-[var(--color-surface-elevated)]/50 border border-[var(--color-border)] rounded-xl p-5 mt-2">
        <h3 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-primary)] uppercase tracking-widest mb-3">
          Princípios do Produto
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[var(--font-size-small)] text-[var(--color-text-secondary)]">
          {[
            "Todo cálculo deve ser tecnicamente correto",
            "Ensinar enquanto calcula",
            "Explicar as hipóteses utilizadas",
            "Mostrar referências e normas",
            "Facilitar a vida do estudante",
            "Continuar útil para o engenheiro profissional",
          ].map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)] mt-0.5 flex-shrink-0">check_circle</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
