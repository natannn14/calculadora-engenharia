import { useState } from "react";
import type { EngineResult } from "../core/types/engine";
import { EngineResultView } from "./engine/EngineResultView";
import { Card, CardContent, CardHeader, CardFooter, Button, Input, Select, SectionHeader } from "./ui";

type BasicoTask = "somar" | "subtrair" | "multiplicar" | "dividir" | "potencia" | "raizQuadrada" | "fatorial" | "porcentagem";

export function BasicoForm() {
  const [task, setTask] = useState<BasicoTask>("somar");
  const [valA, setValA] = useState("0");
  const [valB, setValB] = useState("0");
  const [loading, setLoading] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);

  const taskOptions = [
    { value: "somar", label: "Soma (+)" },
    { value: "subtrair", label: "Subtração (-)" },
    { value: "multiplicar", label: "Multiplicação (*)" },
    { value: "dividir", label: "Divisão (/)" },
    { value: "potencia", label: "Potência (^)" },
    { value: "raizQuadrada", label: "Raiz Quadrada" },
    { value: "fatorial", label: "Fatorial (!)" },
    { value: "porcentagem", label: "Porcentagem (%)" }
  ];

  const isUnary = task === "fatorial" || task === "raizQuadrada";

  async function handleSubmit() {
    setLoading(true);
    setEngineResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/basico/calcular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          operacao: task, 
          a: parseFloat(valA), 
          b: parseFloat(valB) 
        }),
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
        // Fallback for non-refactored backend endpoints
        if (data.resultado !== undefined && data.result === undefined) {
           setEngineResult({
             result: data.resultado,
             calculationSteps: data.passos ? [{ index: 1, description: data.passos }] : undefined
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
      <SectionHeader title="Matemática Básica" subtitle="Módulo: Aritmética" />

      <Card>
        <CardHeader>
          <Select 
            label="Operação" 
            value={task} 
            onChange={e => setTask(e.target.value as BasicoTask)} 
            options={taskOptions}
          />
        </CardHeader>
        
        <CardContent className="flex flex-col gap-[var(--spacing-md)]">
          <Input 
            label="Valor A" 
            type="number" 
            step="any"
            value={valA} 
            onChange={e => setValA(e.target.value)} 
          />
          {!isUnary && (
            <Input 
              label="Valor B" 
              type="number" 
              step="any"
              value={valB} 
              onChange={e => setValB(e.target.value)} 
            />
          )}
        </CardContent>
        
        <CardFooter className="justify-end bg-[var(--color-surface-elevated)]/30">
          <Button variant="secondary" onClick={() => { setValA("0"); setValB("0"); setEngineResult(null); }}>
            Limpar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Calculando..." : "Calcular"}
          </Button>
        </CardFooter>
      </Card>

      {engineResult && <EngineResultView result={engineResult} />}
    </div>
  );
}
