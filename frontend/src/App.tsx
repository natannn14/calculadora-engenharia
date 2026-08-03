import { useState, useEffect } from "react";
import { SymbolicForm } from "./components/SymbolicForm";
import { BeamForm } from "./components/BeamForm";
import "./App.css";

type Tab = "symbolic" | "beam";
type ThemeKey = 
  | "theme-base" 
  | "theme-omnitrix" 
  | "theme-shinobi" 
  | "theme-saiyan" 
  | "theme-miles";

interface ThemeOption {
  key: ThemeKey;
  label: string;
  color: string;
  bg: string;
  shadow: string;
  Logo: () => JSX.Element;
}

const THEMES: ThemeOption[] = [
  { 
    key: "theme-omnitrix",  
    label: "Omnitrix", 
    color: "#4ade80", 
    bg: "#111811", 
    shadow: "shadow-[0_0_15px_rgba(34,197,94,0.4)]",
    Logo: () => (
      <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8">
        <circle cx="50" cy="50" r="45" stroke="#16a34a" strokeWidth="6" fill="#051005" />
        <polygon points="20,20 80,20 65,50 80,80 20,80 35,50" fill="#22c55e" />
        <circle cx="50" cy="50" r="10" fill="#051005" />
      </svg>
    )
  },
  { 
    key: "theme-shinobi",   
    label: "Shinobi",  
    color: "#f97316", 
    bg: "#1f140d", 
    shadow: "shadow-[0_0_15px_rgba(249,115,22,0.4)]",
    Logo: () => (
      <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8">
        <path d="M50 90C27.9 90 10 72.1 10 50C10 27.9 27.9 10 50 10C72.1 10 90 27.9 90 50" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
        <path d="M50 10C65 25 65 75 50 90" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
        <circle cx="50" cy="50" r="15" fill="#ea580c" />
        <path d="M50 50L80 20" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  },
  { 
    key: "theme-saiyan",    
    label: "Saiyan",   
    color: "#60a5fa", 
    bg: "#0f172a", 
    shadow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
    Logo: () => (
      <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8">
        <circle cx="50" cy="50" r="45" fill="#f59e0b" stroke="#d97706" strokeWidth="4" />
        <polygon points="50,20 58,40 80,40 62,55 70,75 50,62 30,75 38,55 20,40 42,40" fill="#dc2626" />
      </svg>
    )
  },
  { 
    key: "theme-miles",     
    label: "Miles",    
    color: "#f43f5e", 
    bg: "#18181b", 
    shadow: "shadow-[0_0_15px_rgba(225,29,72,0.4)]",
    Logo: () => (
      <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8">
        <circle cx="50" cy="50" r="45" fill="#09090b" stroke="#e11d48" strokeWidth="4" />
        <path d="M50 20 L50 80 M20 50 L80 50 M28 28 L72 72 M28 72 L72 28" stroke="#e11d48" strokeWidth="2" opacity="0.5" />
        <circle cx="50" cy="50" r="15" fill="#e11d48" />
        <path d="M50 35 Q65 20 80 40 Q60 60 50 80 Q40 60 20 40 Q35 20 50 35 Z" fill="#e11d48" />
      </svg>
    )
  },
  { 
    key: "theme-base",      
    label: "Swing",    
    color: "#62f9ee", 
    bg: "#1f1f24", 
    shadow: "shadow-[0_0_15px_rgba(98,249,238,0.4)]",
    Logo: () => (
      <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8">
        <rect x="20" y="20" width="60" height="60" rx="10" stroke="#7bd6d1" strokeWidth="6" fill="#121317" />
        <line x1="35" y1="40" x2="65" y2="40" stroke="#62f9ee" strokeWidth="6" strokeLinecap="round" />
        <line x1="35" y1="55" x2="45" y2="55" stroke="#62f9ee" strokeWidth="6" strokeLinecap="round" />
        <line x1="55" y1="55" x2="65" y2="55" stroke="#62f9ee" strokeWidth="6" strokeLinecap="round" />
        <line x1="35" y1="70" x2="45" y2="70" stroke="#62f9ee" strokeWidth="6" strokeLinecap="round" />
        <line x1="55" y1="70" x2="65" y2="70" stroke="#62f9ee" strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  },
];

function App() {
  const [tab, setTab] = useState<Tab>("symbolic");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    return (localStorage.getItem("calc_theme") as ThemeKey) || "theme-base";
  });

  useEffect(() => {
    document.documentElement.className = currentTheme;
    document.body.className = `${currentTheme} transition-colors duration-500`;
    localStorage.setItem("calc_theme", currentTheme);
  }, [currentTheme]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen pb-32 transition-colors duration-500">
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col border-r border-outline-variant transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-lg mb-xl flex items-center justify-between gap-sm">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-on-secondary font-display font-bold">
              ∫
            </div>
            <span className="font-headline-md text-headline-md tracking-tight text-on-surface">CalculaEng</span>
          </div>
          <button className="lg:hidden text-on-surface-variant p-xs" onClick={toggleSidebar}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-md space-y-unit">
          <button
            onClick={() => { setTab("symbolic"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-md px-md py-sm rounded text-left transition-all font-label-caps text-label-caps uppercase ${
              tab === "symbolic" 
                ? "bg-secondary-container text-on-secondary-container" 
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined">functions</span>
            Cálculo Simbólico
          </button>
          
          <button
            onClick={() => { setTab("beam"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-md px-md py-sm rounded text-left transition-all font-label-caps text-label-caps uppercase ${
              tab === "beam" 
                ? "bg-secondary-container text-on-secondary-container" 
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined">schema</span>
            Modelos de Engenharia
          </button>
        </nav>

        <footer className="p-lg mt-auto border-t border-outline-variant space-y-md">
          <button className="w-full flex items-center justify-center gap-sm py-sm border border-secondary text-secondary font-label-caps text-label-caps uppercase hover:bg-secondary hover:text-on-secondary transition-all rounded">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar Relatório
          </button>
        </footer>
      </aside>

      {/* Main Container */}
      <div className="pl-0 lg:pl-72 flex flex-col min-h-screen transition-all duration-300 relative z-10">
        
        {/* Header */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container/80 backdrop-blur-xl z-30 px-sm md:px-lg flex items-center justify-between border-b border-outline-variant">
          <div className="flex items-center gap-xs md:gap-md">
            <button className="lg:hidden text-on-surface p-sm hover:text-secondary flex items-center" onClick={toggleSidebar}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-mono-code text-mono-code text-secondary hidden sm:block">
              CALC_CORE_v2.5
            </span>
          </div>

          <div className="flex items-center gap-sm md:gap-lg">
            <button className="hidden sm:flex items-center gap-sm px-md py-xs border border-secondary text-secondary font-label-caps text-label-caps uppercase hover:bg-secondary hover:text-on-secondary transition-all rounded">
              <span className="material-symbols-outlined text-[18px]">install_desktop</span>
              PWA Install
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="relative pt-16 flex-1 flex flex-col">
          <div className="flex flex-col w-full flex-1 relative">
            <div className="max-w-[1280px] w-full mx-auto relative z-10 flex-1 px-4 lg:px-8 py-6">
              {tab === "symbolic" && <SymbolicForm />}
              {tab === "beam"     && <BeamForm />}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Theme Selector */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-surface-container/95 backdrop-blur-xl border-t border-outline-variant p-md pb-lg shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-40 transition-colors duration-500">
        <div className="font-label-caps text-label-caps text-on-surface-variant mb-sm px-sm">
          Selecione a Aura
        </div>
        <div className="flex gap-md overflow-x-auto custom-scrollbar px-sm pb-sm">
          {THEMES.map((t) => {
            const isActive = currentTheme === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setCurrentTheme(t.key);
                  if (navigator.vibrate) navigator.vibrate(10);
                }}
                className={`theme-btn flex flex-col items-center gap-xs flex-shrink-0 transition-opacity ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              >
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? t.shadow : ""}`}
                  style={{ backgroundColor: t.bg, borderColor: t.color }}
                >
                  <t.Logo />
                </div>
                <span className={`font-label-caps text-[10px] ${isActive ? "text-on-surface" : "text-on-surface-variant"}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default App;
