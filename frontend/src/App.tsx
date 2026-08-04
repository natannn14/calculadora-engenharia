import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Layout, MobileMenu } from "./components/layout";
import { TraceAnimation } from "./components/TraceAnimation";
import "./index.css";
import "./App.css";

// ─── Lazy load calculators (code-splitting per plugin) ───────────────────────
const BasicoForm      = lazy(() => import("./components/BasicoForm").then(m => ({ default: m.BasicoForm })));
const CientificoForm  = lazy(() => import("./components/CientificoForm").then(m => ({ default: m.CientificoForm })));
const AlgebraForm     = lazy(() => import("./components/AlgebraForm").then(m => ({ default: m.AlgebraForm })));
const SymbolicForm    = lazy(() => import("./components/SymbolicForm").then(m => ({ default: m.SymbolicForm })));
const MatrizesForm    = lazy(() => import("./components/MatrizesForm").then(m => ({ default: m.MatrizesForm })));
const ComplexosForm   = lazy(() => import("./components/ComplexosForm").then(m => ({ default: m.ComplexosForm })));
const BeamForm        = lazy(() => import("./components/BeamForm").then(m => ({ default: m.BeamForm })));
const EstatisticaForm = lazy(() => import("./components/EstatisticaForm").then(m => ({ default: m.EstatisticaForm })));
const HomePage        = lazy(() => import("./features/home/HomePage").then(m => ({ default: m.HomePage })));
const BibliotecaPage  = lazy(() => import("./features/biblioteca/BibliotecaPage").then(m => ({ default: m.BibliotecaPage })));

// ─── Themes ──────────────────────────────────────────────────────────────────
type ThemeKey = "theme-omnitrix" | "theme-shinobi" | "theme-saiyan" | "theme-miles";
const THEMES = [
  { key: "theme-omnitrix", label: "Omnitrix",  color: "#4ade80", bg: "#111811" },
  { key: "theme-shinobi",  label: "Shinobi",   color: "#f97316", bg: "#1f140d" },
  { key: "theme-saiyan",   label: "Saiyan",    color: "#60a5fa", bg: "#0f172a" },
  { key: "theme-miles",    label: "Miles",     color: "#f43f5e", bg: "#18181b" },
];

// ─── Route → title map ───────────────────────────────────────────────────────
const ROUTE_TITLES: Record<string, string> = {
  "/":                       "Início",
  "/matematica/basico":      "Calculadora Básica",
  "/matematica/cientifico":  "Calculadora Científica",
  "/matematica/algebra":     "Álgebra e Equações",
  "/matematica/calculo":     "Cálculo Diferencial e Integral",
  "/matematica/matrizes":    "Matrizes e Vetores",
  "/matematica/complexos":   "Números Complexos",
  "/matematica/estatistica": "Estatística e Probabilidade",
  "/engenharia/vigas":       "Engenharia Estrutural — Vigas",
  "/fisica":                 "Física",
  "/engenharia":             "Engenharia",
  "/ferramentas":            "Ferramentas",
  "/biblioteca":             "Biblioteca de Conhecimento",
  "/configuracoes":          "Configurações",
  "/menu":                   "Todos os Módulos",
};

// ─── Loading spinner ─────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <div className="flex flex-col items-center gap-3 text-[var(--color-text-muted)]">
        <span className="material-symbols-outlined text-[40px] text-[var(--color-primary)] animate-spin" style={{ animationDuration: '1.2s' }}>
          autorenew
        </span>
        <span className="font-mono-code text-[var(--font-size-small)] uppercase tracking-widest">
          Carregando módulo...
        </span>
      </div>
    </div>
  );
}

// ─── Module placeholders (Física, Ferramentas, Config) ───────────────────────
function ModulePlaceholder({ title, icon, items = [] }: { title: string; icon: string; items?: string[] }) {
  return (
    <div className="flex flex-col gap-6 items-start py-4 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-[48px] text-[var(--color-primary)]">{icon}</span>
        <div>
          <h1 className="font-display text-[var(--font-size-h1)] text-[var(--color-text-primary)] leading-none">{title}</h1>
          <span className="font-mono-code text-[var(--font-size-small)] text-[var(--color-primary)] uppercase tracking-widest opacity-70">
            Em desenvolvimento
          </span>
        </div>
      </div>
      {items.length > 0 && (
        <div className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-6">
          <p className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest mb-4">
            Previsto para este módulo:
          </p>
          <ul className="flex flex-col gap-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-body-md text-[var(--color-text-secondary)]">
                <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">schedule</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const location = useLocation();
  const pageTitle = ROUTE_TITLES[location.pathname] ?? "CalculaEng";

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem("calc_theme");
    return (saved as ThemeKey) || "theme-omnitrix";
  });

  useEffect(() => {
    document.documentElement.className = currentTheme === "theme-omnitrix" ? "" : currentTheme;
    localStorage.setItem("calc_theme", currentTheme);
  }, [currentTheme]);

  const HeaderRight = (
    <div className="relative">
      <button
        onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
        className="w-[48px] h-[48px] flex items-center justify-center rounded-full hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all border border-transparent hover:border-[var(--color-border)]"
        title="Configurações de Aura"
      >
        <span className="material-symbols-outlined text-[24px]">palette</span>
      </button>

      {isThemeMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-lg)] p-3 flex flex-col gap-2 min-w-[180px]">
            <span className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest px-2 pb-1 border-b border-[var(--color-border)]">
              Aura do Sistema
            </span>
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => { setCurrentTheme(t.key as ThemeKey); setIsThemeMenuOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--font-size-small)] font-label-caps transition-all ${currentTheme === t.key ? "bg-[var(--color-surface-elevated)] text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]"}`}
              >
                <span className="w-3 h-3 rounded-full border-2 border-white/20 flex-shrink-0" style={{ backgroundColor: t.color }} />
                {t.label}
                {currentTheme === t.key && <span className="material-symbols-outlined text-[14px] ml-auto">check</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <Layout headerRight={HeaderRight} pageTitle={pageTitle}>
      <TraceAnimation theme={currentTheme} triggerKey={location.pathname} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* ── Home ─────────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />

          {/* ── Matemática ───────────────────────────────────── */}
          <Route path="/matematica/basico"      element={<BasicoForm />} />
          <Route path="/matematica/cientifico"  element={<CientificoForm />} />
          <Route path="/matematica/algebra"     element={<AlgebraForm />} />
          <Route path="/matematica/calculo"     element={<SymbolicForm />} />
          <Route path="/matematica/matrizes"    element={<MatrizesForm />} />
          <Route path="/matematica/complexos"   element={<ComplexosForm />} />
          <Route path="/matematica/estatistica" element={<EstatisticaForm />} />
          <Route path="/matematica" element={<Navigate to="/" replace />} />

          {/* ── Física ───────────────────────────────────────── */}
          <Route path="/fisica" element={
            <ModulePlaceholder title="Física" icon="bolt" items={["Cinemática e Dinâmica", "Termodinâmica", "Eletromagnetismo", "Óptica e Ondas"]} />
          } />

          {/* ── Engenharia ───────────────────────────────────── */}
          <Route path="/engenharia/vigas" element={<BeamForm />} />
          <Route path="/engenharia" element={
            <ModulePlaceholder title="Engenharia" icon="engineering" items={["Resistência dos Materiais", "Hidráulica e Hidrologia", "Circuitos Elétricos", "Geotecnia"]} />
          } />

          {/* ── Ferramentas ──────────────────────────────────── */}
          <Route path="/ferramentas" element={
            <ModulePlaceholder title="Ferramentas" icon="build" items={["Conversor de Unidades", "Memorial Descritivo (PDF)", "Calculadora de Constantes"]} />
          } />

          {/* ── Biblioteca ───────────────────────────────────── */}
          <Route path="/biblioteca" element={<BibliotecaPage />} />

          {/* ── Configurações ────────────────────────────────── */}
          <Route path="/configuracoes" element={
            <ModulePlaceholder title="Configurações" icon="settings" items={["Modo Estudante / Profissional", "Seleção de PPC do Curso", "Idioma (i18n)", "PWA e Offline"]} />
          } />

          {/* ── Mobile Menu ──────────────────────────────────── */}
          <Route path="/menu" element={<MobileMenu />} />

          {/* ── Fallback ─────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
