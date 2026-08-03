import { useState, useEffect } from "react";
import type { SymbolicRequest, SymbolicResponse, SymbolicTask, ApiError } from "../types";
import { SymbolicKeyboard } from "./SymbolicKeyboard";
import { StepsAccordion } from "./StepsAccordion";

export function SymbolicForm() {
  const [task, setTask] = useState<SymbolicTask>("derive");
  const [expr, setExpr] = useState("x^3 * sin(x)");
  const [variable, setVariable] = useState("x");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SymbolicResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("calc_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch { /* ignora */ }
  }, []);

  function saveToHistory(expression: string) {
    setHistory((prev) => {
      const updated = [expression, ...prev.filter((e) => e !== expression)].slice(0, 15);
      localStorage.setItem("calc_history", JSON.stringify(updated));
      return updated;
    });
  }

  function handleInsert(text: string, newTask?: SymbolicTask) {
    if (newTask) { setTask(newTask); return; }
    setExpr((prev) => prev + text);
  }

  function handleBackspace() {
    setExpr((prev) => prev.slice(0, -1));
  }

  function formatResult(result: string): string {
    if (task === "integrate") {
      const trimmed = result.trim();
      if (!trimmed.endsWith("+ C") && !trimmed.endsWith("+C")) {
        return `${trimmed} + C`;
      }
    }
    return result;
  }

  async function handleSubmit() {
    if (!expr) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    const payload: SymbolicRequest = { task, expr, variable, lang: "pt-BR" };

    try {
      const res = await fetch("http://localhost:8080/api/symbolic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData: ApiError = await res.json().catch(() => ({ error: `Erro HTTP: ${res.status}` }));
        throw new Error(errorData.error || `Erro HTTP: ${res.status}`);
      }

      const data: SymbolicResponse = await res.json();
      setResponse(data);
      saveToHistory(`${task}: ${expr} [${variable}]`);
    } catch (err: any) {
      setError(err.message || "Erro ao comunicar com o backend");
    } finally {
      setLoading(false);
    }
  }

  const TASK_LABELS: Record<SymbolicTask, string> = {
    derive:    "Derivar",
    integrate: "Integrar (indefinida)",
    simplify:  "Simplificar",
    solve:     "Resolver (== 0)",
    expand:    "Expandir Polinômio",
    factor:    "Fatorar Expressão",
    limit:     "Calcular Limite (x→0)",
    taylor:    "Série de Taylor (O=5)",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full">
      
      {/* Esquerda: Entrada e Teclado */}
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-lg h-auto lg:h-full">
        
        {/* Header Section */}
        <div className="flex items-baseline justify-between w-full border-b border-surface-tint pb-sm mb-sm relative flex-wrap gap-sm">
          <div className="absolute -bottom-[1px] left-0 w-1/3 h-[2px] bg-secondary shadow-[0_0_8px_var(--tw-shadow-color)] shadow-secondary"></div>
          <div>
            <h1 className="font-display text-[32px] md:text-[40px] text-on-surface tracking-tight uppercase leading-none">
              Cálculo Simbólico
            </h1>
            <p className="font-mono-data text-[12px] md:text-mono-data text-secondary mt-xs opacity-80">
              ENV: BR_ENG_V2 | PRECISION: HIGH
            </p>
          </div>
          <div className="flex items-center gap-sm self-end md:self-auto mb-xs md:mb-0">
            <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_6px_var(--tw-shadow-color)] shadow-secondary animate-pulse"></div>
            <span className="font-label-caps text-[10px] md:text-label-caps text-on-surface-variant uppercase tracking-widest">
              Engine Ready
            </span>
          </div>
        </div>

        {/* ERRO */}
        {error && (
          <div className="bg-error-container/20 border border-error text-error p-md rounded-lg font-mono-data text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Input Area */}
        <div className="calc-panel group relative flex flex-col bg-surface-container rounded-lg border-b border-surface-tint transition-all focus-within:border-secondary focus-within:border focus-within:shadow-[0_0_12px_rgba(var(--color-secondary),0.15)] overflow-hidden">
          
          {/* Input Header bar */}
          <div className="bg-surface-container-high w-full flex items-center px-sm py-xs gap-md border-b border-outline-variant/30 overflow-x-auto custom-scrollbar">
            <div className="flex gap-xs hidden sm:flex">
              <div className="w-2 h-2 rounded-full bg-error"></div>
              <div className="w-2 h-2 rounded-full bg-surface-tint"></div>
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
            </div>
            
            <div className="flex items-center gap-sm">
              <span className="font-mono-code text-[11px] text-on-surface-variant">TAREFA:</span>
              <select
                value={task}
                onChange={(e) => setTask(e.target.value as SymbolicTask)}
                className="bg-surface border border-outline-variant text-on-surface font-mono-code text-[11px] px-2 py-0.5 rounded outline-none focus:border-secondary"
              >
                {(Object.keys(TASK_LABELS) as SymbolicTask[]).map((t) => (
                  <option key={t} value={t}>{TASK_LABELS[t]}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-sm">
              <span className="font-mono-code text-[11px] text-on-surface-variant">VAR:</span>
              <input
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="bg-surface border border-outline-variant text-on-surface font-mono-code text-[11px] px-2 py-0.5 rounded outline-none focus:border-secondary w-12 text-center"
                placeholder="x"
              />
            </div>
            
            <span className="font-mono-code text-[11px] text-on-surface-variant opacity-50 ml-auto hidden md:inline">
              INPUT_BUFFER_01
            </span>
          </div>

          <div className="relative p-md pb-xl">
            <textarea
              className="text-glitch w-full bg-transparent resize-none outline-none font-mono-data text-[24px] md:text-[28px] text-primary placeholder-on-surface-variant/30 min-h-[120px]"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="f(x) = ..."
              spellCheck={false}
              style={{ caretColor: "var(--color-secondary)" }}
            />
            
            {/* Decorative grid overlay inside input */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-5" 
              style={{
                backgroundSize: "20px 20px", 
                backgroundImage: "linear-gradient(to right, var(--color-surface-tint) 1px, transparent 1px), linear-gradient(to bottom, var(--color-surface-tint) 1px, transparent 1px)"
              }}
            ></div>
          </div>
          
          {/* Floating actions */}
          <div className="absolute bottom-md right-md flex gap-sm">
            <button 
              onClick={() => setExpr("")}
              className="bg-transparent border border-outline-variant text-on-surface-variant font-label-caps text-[10px] md:text-label-caps px-sm md:px-md py-xs md:py-sm rounded hover:bg-surface-variant hover:text-on-surface transition-colors uppercase"
            >
              Limpar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-secondary/10 border border-secondary text-secondary font-label-caps text-[10px] md:text-label-caps px-sm md:px-md py-xs md:py-sm rounded hover:bg-secondary hover:text-on-secondary transition-colors uppercase shadow-[0_0_10px_rgba(102,252,241,0.2)]"
            >
              {loading ? "Computando..." : "Computar"}
            </button>
          </div>
        </div>

        <SymbolicKeyboard onInsert={handleInsert} onBackspace={handleBackspace} />
      </div>

      {/* Direita: Resolução */}
      <div className="col-span-1 lg:col-span-5 h-[500px] lg:h-full flex flex-col mt-lg lg:mt-0 relative group">
        
        {/* Linha vertical conectora de decoração */}
        <div className="hidden lg:block absolute -left-[10px] top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-outline-variant to-transparent"></div>
        
        {response ? (
          <StepsAccordion steps={[formatResult(response.result), ...response.steps]} />
        ) : (
          <div className="calc-panel bg-surface-container h-full rounded-lg flex flex-col items-center justify-center border-t border-outline-variant/30 text-on-surface-variant opacity-50">
            <span className="material-symbols-outlined text-[48px] mb-md">functions</span>
            <p className="font-mono-data text-[14px]">Aguardando input...</p>
          </div>
        )}

        {/* Histórico simplificado em linha (ou escondido na interface nova, mas vamos manter como uma barra inferior) */}
        {history.length > 0 && (
          <div className="calc-panel mt-md bg-surface-container-low border border-outline-variant/30 rounded p-sm max-h-[100px] overflow-y-auto custom-scrollbar">
            <p className="font-label-caps text-[10px] text-on-surface-variant mb-xs">HISTÓRICO</p>
            <div className="flex flex-col gap-1">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="font-mono-code text-[11px] text-on-surface hover:text-secondary cursor-pointer truncate"
                  onClick={() => {
                    // formato: "task: expr [var]"
                    const match = h.match(/^([^:]+):\s+(.+?)\s+\[([^\]]+)\]$/);
                    if (match) {
                      setTask(match[1] as SymbolicTask);
                      setExpr(match[2]);
                      setVariable(match[3]);
                    }
                  }}
                >
                  › {h}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
