import { useState } from "react";
import type { EngineResult } from "../core/types/engine";
import { EngineResultView } from "./engine/EngineResultView";
import { Card, CardContent, CardHeader, CardFooter, Button, Input, Select, SectionHeader } from "./ui";

type CientificoTask = "log" | "ln" | "seno" | "cosseno" | "tangente" | "arcoSeno" | "arcoCosseno" | "arcoTangente" | "senoHiperbolico" | "cossenoHiperbolico" | "tangenteHiperbolico" | "exponencial" | "logBase" | "pi" | "e" | "phi";

export function CientificoForm() {
  const [task, setTask] = useState<CientificoTask>("seno");
  const [val, setVal] = useState("0");
  const [base, setBase] = useState("10"); // Apenas para logBase
  const [isGraus, setIsGraus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);

  const taskOptions = [
    { value: "seno", label: "Seno (sen)" },
    { value: "cosseno", label: "Cosseno (cos)" },
    { value: "tangente", label: "Tangente (tan)" },
    { value: "arcoSeno", label: "Arco Seno (arcsen)" },
    { value: "arcoCosseno", label: "Arco Cosseno (arccos)" },
    { value: "arcoTangente", label: "Arco Tangente (arctan)" },
    { value: "senoHiperbolico", label: "Seno Hiperbólico (sinh)" },
    { value: "cossenoHiperbolico", label: "Cosseno Hiperbólico (cosh)" },
    { value: "tangenteHiperbolico", label: "Tangente Hiperbólica (tanh)" },
    { value: "log10", label: "Logaritmo (log10)" },
    { value: "ln", label: "Logaritmo Natural (ln)" },
    { value: "logBase", label: "Logaritmo em Base Específica" },
    { value: "exponencial", label: "Exponencial (e^x)" },
    { value: "pi", label: "Constante π" },
    { value: "e", label: "Constante e" },
    { value: "phi", label: "Proporção Áurea (φ)" }
  ];

  const needsBase = task === "logBase";
  const isConstant = task === "pi" || task === "e" || task === "phi";
  const needsAngleToggle = ["seno", "cosseno", "tangente", "arcoSeno", "arcoCosseno", "arcoTangente"].includes(task);

  async function handleSubmit() {
    setLoading(true);
    setEngineResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      
      const payload: any = { 
        operacao: task, 
        a: parseFloat(val),
        isGraus: isGraus
      };
      
      if (needsBase) {
        payload.base = parseFloat(base);
      }

      const res = await fetch(`${apiUrl}/api/cientifico/calcular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        setEngineResult(data);
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
      <SectionHeader title="Calculadora Científica" subtitle="Módulo: Funções Transcendentes" />

      <Card>
        <CardHeader>
          <Select 
            label="Função" 
            value={task} 
            onChange={e => setTask(e.target.value as CientificoTask)} 
            options={taskOptions}
          />
        </CardHeader>
        
        <CardContent className="flex flex-col gap-[var(--spacing-md)]">
          {!isConstant && (
            <Input 
              label={needsAngleToggle ? "Ângulo" : "Valor"} 
              type="number" 
              step="any"
              value={val} 
              onChange={e => setVal(e.target.value)} 
            />
          )}

          {needsAngleToggle && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-400 font-mono">Radianos</span>
              <button 
                onClick={() => setIsGraus(!isGraus)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isGraus ? 'bg-emerald-500' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isGraus ? 'translate-x-6' : ''}`}></div>
              </button>
              <span className="text-sm text-gray-400 font-mono">Graus</span>
            </div>
          )}

          {needsBase && (
            <Input 
              label="Base do Logaritmo" 
              type="number" 
              step="any"
              value={base} 
              onChange={e => setBase(e.target.value)} 
            />
          )}
        </CardContent>
        
        <CardFooter className="justify-end bg-[var(--color-surface-elevated)]/30">
          <Button variant="secondary" onClick={() => { setVal("0"); setBase("10"); setEngineResult(null); }}>
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
