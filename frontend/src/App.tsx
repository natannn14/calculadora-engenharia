import { useState } from "react";
import { SymbolicForm } from "./components/SymbolicForm";
import { BeamForm } from "./components/BeamForm";
import "./App.css";

type Tab = "symbolic" | "beam";

function App() {
  const [tab, setTab] = useState<Tab>("symbolic");
  const [isLight, setIsLight] = useState(false);

  function toggleTheme() {
    setIsLight((v) => {
      const next = !v;
      document.documentElement.classList.toggle("light", next);
      return next;
    });
  }

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
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isLight ? "Mudar para escuro" : "Mudar para claro"}
            aria-label="Alternar tema"
          >
            {isLight ? "🌙" : "☀️"}
          </button>
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
        Tema Legacy-Swing Web
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
