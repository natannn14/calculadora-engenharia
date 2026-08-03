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

  /** 💡 Dica de Ouro: integral indefinida → adiciona " + C" */
  function formatResult(result: string): string {
    if (task === "integrate") {
      const trimmed = result.trim();
      if (!trimmed.endsWith("+ C") && !trimmed.endsWith("+C")) {
        return `${trimmed} + C`;
      }
    }
    return result;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      saveToHistory(`${task}: ${expr}`);
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* FORM */}
      <div className="calc-card">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* TAREFA */}
          <div>
            <label className="field-label" htmlFor="sym-task">Tarefa</label>
            <select
              id="sym-task"
              className="field-select"
              value={task}
              onChange={(e) => setTask(e.target.value as SymbolicTask)}
            >
              {(Object.keys(TASK_LABELS) as SymbolicTask[]).map((t) => (
                <option key={t} value={t}>{TASK_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {/* EXPRESSÃO */}
          <div>
            <label className="field-label" htmlFor="sym-expr">Expressão</label>
            <input
              id="sym-expr"
              className="field-input"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="ex.: x^3 * sin(x)"
              spellCheck={false}
            />
          </div>

          {/* VARIÁVEL */}
          <div>
            <label className="field-label" htmlFor="sym-var">Variável</label>
            <input
              id="sym-var"
              className="field-input"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              placeholder="ex.: x"
              style={{ maxWidth: "120px" }}
            />
          </div>

          {/* TECLADO */}
          <SymbolicKeyboard onInsert={handleInsert} />

          {/* BOTÃO CALCULAR */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-calcular"
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span>
                Calculando...
              </>
            ) : (
              "Calcular"
            )}
          </button>
        </form>
      </div>

      {/* ERRO */}
      {error && (
        <div className="alert-error" role="alert">
          ⚠ {error}
        </div>
      )}

      {/* RESULTADO */}
      {response && (
        <div className="calc-card result-appear">
          <p className="field-label" style={{ marginBottom: "0.75rem" }}>
            Resultado{task === "integrate" ? " (+ C — constante de integração)" : ""}
          </p>
          <div className="visor">
            {formatResult(response.result)}
          </div>
          <StepsAccordion steps={response.steps} />
        </div>
      )}

      {/* HISTÓRICO */}
      {history.length > 0 && (
        <div className="calc-card">
          <p className="field-label" style={{ marginBottom: "0.6rem" }}>Histórico</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "2px" }}>
            {history.map((h, i) => (
              <li
                key={i}
                className="history-item"
                onClick={() => {
                  const [t, ...rest] = h.split(": ");
                  setTask(t as SymbolicTask);
                  setExpr(rest.join(": "));
                }}
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
