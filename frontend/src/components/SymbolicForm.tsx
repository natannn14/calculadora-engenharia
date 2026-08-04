import { useState } from "react";
import type { SymbolicRequest, SymbolicTask } from "../types";
import { SymbolicKeyboard } from "./SymbolicKeyboard";
import { Card, CardContent, CardHeader, CardFooter, Button, Input, Select, SectionHeader } from "./ui";
import type { EngineResult } from "../core/types/engine";
import { EngineResultView } from "./engine/EngineResultView";

export function SymbolicForm() {
  const [task, setTask] = useState<SymbolicTask>("derive");
  const [expr, setExpr] = useState("x^3 * sin(x)");
  const [variable, setVariable] = useState("x");
  const [lowerLimit, setLowerLimit] = useState<string>("0");
  const [upperLimit, setUpperLimit] = useState<string>("1");
  const [subintervals, setSubintervals] = useState<string>("100");
  const [loading, setLoading] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);

  function handleInsert(text: string, newTask?: SymbolicTask) {
    if (newTask) { setTask(newTask); return; }
    setExpr((prev) => prev + text);
  }
  function handleBackspace() { setExpr((prev) => prev.slice(0, -1)); }

  async function handleSubmit() {
    if (!expr) return;
    setLoading(true); setEngineResult(null);

    const payload: SymbolicRequest = { task, expr, variable, lang: "pt-BR" };
    if (task === "integral_trapezio" || task === "integral_simpson") {
      payload.lowerLimit = parseFloat(lowerLimit) || 0;
      payload.upperLimit = parseFloat(upperLimit) || 0;
      payload.subintervals = parseInt(subintervals, 10) || 100;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/symbolic`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });

      const data: any = await res.json();

      if (!res.ok) {
        if (data.warnings) {
           setEngineResult(data);
        } else {
           setEngineResult({
             result: "Erro",
             warnings: [{ code: "HTTP_ERROR", message: data.error || data.erro || `Erro HTTP: ${res.status}`, severity: "ERROR" }]
           });
        }
      } else {
        if (data.resultado === undefined && data.result !== undefined && data.calculationSteps === undefined) {
           setEngineResult({
             result: data.result,
             calculationSteps: data.steps ? data.steps.map((p: string, i: number) => ({ index: i+1, description: p })) : undefined
           });
        } else {
           setEngineResult(data);
        }
      }
    } catch (err: any) {
      setEngineResult({
        result: "Erro",
        warnings: [{ code: "NETWORK_ERROR", message: err.message || "Erro ao comunicar com o backend", severity: "ERROR" }]
      });
    } finally {
      setLoading(false);
    }
  }

  const taskOptions = [
    { value: "derive", label: "Derivar" },
    { value: "integrate", label: "Integrar (indefinida)" },
    { value: "simplify", label: "Simplificar" },
    { value: "solve", label: "Resolver (== 0)" },
    { value: "expand", label: "Expandir Polinômio" },
    { value: "factor", label: "Fatorar Expressão" },
    { value: "limit", label: "Calcular Limite (x→0)" },
    { value: "taylor", label: "Série de Taylor (O=5)" },
    { value: "partial_derivative", label: "Derivada Parcial" },
    { value: "integral_trapezio", label: "Integral (Trapézio)" },
    { value: "integral_simpson", label: "Integral (Simpson 1/3)" },
  ];

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)] w-full max-w-5xl mx-auto tema-omnitrix">
      <SectionHeader title="Cálculo Diferencial e Integral" subtitle="Engine Ready | Precision: High" />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row w-full gap-[var(--spacing-md)]">
            <div className="flex-1">
              <Select label="Tarefa" value={task} onChange={e => setTask(e.target.value as SymbolicTask)} options={taskOptions} />
            </div>
            <div className="w-full md:w-32">
              <Input label="Var" value={variable} onChange={e => setVariable(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative mb-[var(--spacing-md)]">
            <textarea
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-[var(--spacing-md)] resize-none outline-none font-mono-data text-[var(--font-size-h2)] text-[var(--color-primary)] placeholder-[var(--color-text-muted)] min-h-[120px] focus:border-[var(--color-primary)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),_0_0_0_1px_var(--color-primary)] transition-all"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="Digite a expressão..."
              spellCheck={false}
            />
          </div>

          {(task === "integral_trapezio" || task === "integral_simpson") && (
            <div className="grid grid-cols-3 gap-[var(--spacing-md)] mb-[var(--spacing-md)]">
              <Input label="L. Inf." value={lowerLimit} onChange={e => setLowerLimit(e.target.value)} />
              <Input label="L. Sup." value={upperLimit} onChange={e => setUpperLimit(e.target.value)} />
              <Input label="N" value={subintervals} onChange={e => setSubintervals(e.target.value)} />
            </div>
          )}

          <SymbolicKeyboard onInsert={handleInsert} onBackspace={handleBackspace} />
        </CardContent>

        <CardFooter className="justify-end bg-[var(--color-surface-elevated)]/30">
          <Button variant="secondary" onClick={() => { setExpr(""); setEngineResult(null); }}>Limpar</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Computando..." : "Computar"}</Button>
        </CardFooter>
      </Card>

      {engineResult && <EngineResultView result={engineResult} />}
    </div>
  );
}