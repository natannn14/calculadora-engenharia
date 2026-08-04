import { useState } from "react";
import type { SymbolicRequest } from "../types";
import { SymbolicKeyboard } from "./SymbolicKeyboard";
import { Card, CardContent, CardHeader, CardFooter, Button, Input, Select, SectionHeader } from "./ui";
import type { EngineResult } from "../core/types/engine";
import { EngineResultView } from "./engine/EngineResultView";

type AlgebraTask = "solve" | "solve_system" | "mdc" | "mmc" | "fraction_to_decimal" | "decimal_to_fraction";

export function AlgebraForm() {
  const [task, setTask] = useState<AlgebraTask>("solve");
  const [expr, setExpr] = useState("x^2 + 4");
  const [variable, setVariable] = useState("x");
  const [loading, setLoading] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);

  const taskOptions = [
    { value: "solve", label: "Resolver Equação (== 0)" },
    { value: "solve_system", label: "Resolver Sistema Linear" },
    { value: "mdc", label: "Máximo Divisor Comum (MDC)" },
    { value: "mmc", label: "Mínimo Múltiplo Comum (MMC)" },
    { value: "fraction_to_decimal", label: "Fração para Decimal" },
    { value: "decimal_to_fraction", label: "Decimal para Fração" },
  ];

  function handleInsert(text: string) {
    setExpr((prev) => prev + text);
  }

  function handleBackspace() {
    setExpr((prev) => prev.slice(0, -1));
  }

  async function handleSubmit() {
    if (!expr) return;
    
    setLoading(true);
    setEngineResult(null);

    const payload: SymbolicRequest = { task, expr, variable, lang: "pt-BR" };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/symbolic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
           // SymbolicResponse format
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

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)] w-full max-w-4xl mx-auto tema-omnitrix">
      <SectionHeader title="Álgebra e Equações" subtitle="Módulo: Álgebra" />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row w-full gap-[var(--spacing-md)]">
            <div className="flex-1">
              <Select 
                label="Tarefa" 
                value={task} 
                onChange={e => setTask(e.target.value as AlgebraTask)} 
                options={taskOptions}
              />
            </div>
            <div className="w-full sm:w-32">
              <Input 
                label="Variável(is)" 
                value={variable} 
                onChange={e => setVariable(e.target.value)} 
                placeholder={task === "solve_system" ? "{x,y}" : "x"}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative">
            <textarea
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-[var(--spacing-md)] resize-none outline-none font-mono-data text-[var(--font-size-h2)] text-[var(--color-primary)] placeholder-[var(--color-text-muted)] min-h-[120px] focus:border-[var(--color-primary)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),_0_0_0_1px_var(--color-primary)] transition-all"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder={
                task === "solve_system" ? "{x+y==10, x-y==2}" :
                task === "mdc" ? "48, 18" :
                "f(x) = ..."
              }
              spellCheck={false}
            />
          </div>
          
          <div className="mt-[var(--spacing-md)]">
            <SymbolicKeyboard onInsert={handleInsert} onBackspace={handleBackspace} />
          </div>
        </CardContent>
        
        <CardFooter className="justify-end bg-[var(--color-surface-elevated)]/30">
          <Button variant="secondary" onClick={() => { setExpr(""); setEngineResult(null); }}>
            Limpar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Computando..." : "Computar"}
          </Button>
        </CardFooter>
      </Card>

      {engineResult && <EngineResultView result={engineResult} />}
    </div>
  );
}
