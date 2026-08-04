import { useState } from "react";
import type { EngineResult } from "../core/types/engine";
import { EngineResultView } from "./engine/EngineResultView";
import { Card, CardContent, CardHeader, CardFooter, Button, Input, Select, SectionHeader } from "./ui";

type ComplexosTask = "add" | "sub" | "mul" | "div" | "to_polar" | "to_rect";

export function ComplexosForm() {
  const [task, setTask] = useState<ComplexosTask>("add");
  const [real1, setReal1] = useState("");
  const [imag1, setImag1] = useState("");
  const [real2, setReal2] = useState("");
  const [imag2, setImag2] = useState("");
  const [modulo, setModulo] = useState("");
  const [argumento, setArgumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);

  const taskOptions = [
    { value: "add", label: "Soma" },
    { value: "sub", label: "Subtração" },
    { value: "mul", label: "Multiplicação" },
    { value: "div", label: "Divisão" },
    { value: "to_polar", label: "Converter para Polar" },
    { value: "to_rect", label: "Converter para Retangular" },
  ];

  async function handleSubmit() {
    setLoading(true); setEngineResult(null);

    const payload: any = { operacao: task };
    if (task === "to_rect") {
      payload.modulo = parseFloat(modulo) || 0;
      payload.argumento = parseFloat(argumento) || 0;
    } else {
      payload.real1 = parseFloat(real1) || 0;
      payload.imag1 = parseFloat(imag1) || 0;
      if (task !== "to_polar") {
        payload.real2 = parseFloat(real2) || 0;
        payload.imag2 = parseFloat(imag2) || 0;
      }
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/complexos`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });

      const data = await res.json();
      
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
        if (data.resultado !== undefined && data.result === undefined) {
           setEngineResult({
             result: data.resultado,
             calculationSteps: data.passos ? data.passos.map((p: string, i: number) => ({ index: i+1, description: p })) : undefined
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
      <SectionHeader title="Números Complexos" subtitle="Fase: 6" />

      <Card>
        <CardHeader>
          <Select label="Operação" value={task} onChange={e => setTask(e.target.value as ComplexosTask)} options={taskOptions} />
        </CardHeader>
        
        <CardContent className="flex flex-col gap-[var(--spacing-md)]">
          {task === "to_rect" ? (
            <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
              <Input label="Módulo (R)" value={modulo} onChange={e => setModulo(e.target.value)} />
              <Input label="Ângulo (°)" value={argumento} onChange={e => setArgumento(e.target.value)} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-[var(--spacing-md)] p-[var(--spacing-md)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                <span className="col-span-2 font-label-caps text-[var(--color-text-secondary)]">Complexo 1</span>
                <Input label="Real" value={real1} onChange={e => setReal1(e.target.value)} />
                <Input label="Imaginário (i)" value={imag1} onChange={e => setImag1(e.target.value)} />
              </div>
              {task !== "to_polar" && (
                <div className="grid grid-cols-2 gap-[var(--spacing-md)] p-[var(--spacing-md)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                  <span className="col-span-2 font-label-caps text-[var(--color-text-secondary)]">Complexo 2</span>
                  <Input label="Real" value={real2} onChange={e => setReal2(e.target.value)} />
                  <Input label="Imaginário (i)" value={imag2} onChange={e => setImag2(e.target.value)} />
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="justify-end bg-[var(--color-surface-elevated)]/30">
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Computando..." : "Computar"}</Button>
        </CardFooter>
      </Card>

      {engineResult && <EngineResultView result={engineResult} />}
    </div>
  );
}