import { useState, useEffect } from "react";
import { SymbolicForm } from "./components/SymbolicForm";
import { BeamForm } from "./components/BeamForm";
import "./App.css";

type Tab = "symbolic" | "beam";
type ThemeKey = 
  | "theme-escuro" 
  | "theme-claro" 
  | "theme-ben10" 
  | "theme-goku" 
  | "theme-naruto" 
  | "theme-miles" 
  | "theme-peter";

interface ThemeOption {
  key: ThemeKey;
  label: string;
  icon: string;
}

const THEMES: ThemeOption[] = [
  { key: "theme-escuro", label: "Escuro (Swing)", icon: "🌙" },
  { key: "theme-claro",  label: "Claro (Swing)", icon: "☀️" },
  { key: "theme-ben10",  label: "Ben 10", icon: "🟢" },
  { key: "theme-goku",   label: "Goku", icon: "🟠" },
  { key: "theme-naruto", label: "Naruto", icon: "🦊" },
  { key: "theme-miles",  label: "Spider-Miles", icon: "🕷️" },
  { key: "theme-peter",  label: "Spider-Peter", icon: "🔴" },
];

function App() {
  const [tab, setTab] = useState<Tab>("symbolic");
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    return (localStorage.getItem("calc_theme") as ThemeKey) || "theme-escuro";
  });

  useEffect(() => {
    document.documentElement.className = currentTheme;
    localStorage.setItem("calc_theme", currentTheme);
  }, [currentTheme]);

  return (
    <>
      {/* HEADER */}
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon" aria-hidden="true">∫</div>
          <span className="app-logo-text">
            Calcula<span>Eng</span>
          </span>
        </div>

        <div className="app-header-right">
          <span className="version-badge">MVP Alpha</span>
          
          {/* Seletor de Tema do Legacy */}
          <div className="theme-select-wrapper">
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value as ThemeKey)}
              className="field-select"
              style={{
                fontSize: "0.82rem",
                padding: "0.4rem 1.8rem 0.4rem 0.6rem",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
              }}
              aria-label="Selecionar tema"
            >
              {THEMES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="app-hero">
        <h2>
          Cálculo <span className="accent">Simbólico</span> e Estrutural
        </h2>
        <p>Derivadas, integrais, vigas — tudo num só lugar.</p>
        <div className="hero-dots" aria-hidden="true">
          <span className="hero-dot" />
          <span className="hero-dot" />
          <span className="hero-dot" />
        </div>
      </section>

      {/* NAV TABS */}
      <nav className="app-nav" aria-label="Módulos">
        <TabButton
          id="tab-symbolic"
          label="⊂ Cálculo Simbólico"
          active={tab === "symbolic"}
          onClick={() => setTab("symbolic")}
        />
        <TabButton
          id="tab-beam"
          label="▤ Viga Bi-apoiada"
          active={tab === "beam"}
          onClick={() => setTab("beam")}
        />
      </nav>

      {/* MAIN */}
      <main className="app-main">
        {tab === "symbolic" && <SymbolicForm />}
        {tab === "beam"     && <BeamForm />}
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        Spring Boot (Symja)
        <span className="dot" />
        React + Vite
        <span className="dot" />
        7 Temas Legacy-Swing
      </footer>
    </>
  );
}

function TabButton({
  id,
  label,
  active,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`tab-btn${active ? " active" : ""}`}
    >
      {label}
    </button>
  );
}

export default App;
