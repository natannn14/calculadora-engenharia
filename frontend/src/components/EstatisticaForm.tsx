import { useState } from "react";
import type { EngineResult } from "../core/types/engine";
import { EngineResultView } from "./engine/EngineResultView";
import { Card, CardContent, CardHeader, CardFooter, Button, Input, Select, SectionHeader } from "./ui";

type EstatisticaTask = 
  | "media" | "mediana" | "moda" 
  | "desvio_amostral" | "desvio_populacional" 
  | "variancia_amostral" | "variancia_populacional" 
  | "normal_pdf" | "normal_cdf" 
  | "binomial_pdf" | "binomial_cdf" 
  | "combinacao" | "permutacao" 
  | "regressao_linear";

export function EstatisticaForm() {
  const [task, setTask] = useState<EstatisticaTask>("media");
  const [loading, setLoading] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);

  const [dados, setDados] = useState("1.5, 2.0, 3.5, 4.0");
  const [normMedia, setNormMedia] = useState(0);
  const [normDesvio, setNormDesvio] = useState(1);
  const [normX, setNormX] = useState(0);
  const [binN, setBinN] = useState(10);
  const [binK, setBinK] = useState(5);
  const [binP, setBinP] = useState(0.5);
  const [xDados, setXDados] = useState("1, 2, 3, 4, 5");
  const [yDados, setYDados] = useState("2.2, 2.8, 3.6, 4.5, 5.1");

  const taskOptions = [
    { value: "media", label: "Média" },
    { value: "mediana", label: "Mediana" },
    { value: "moda", label: "Moda" },
    { value: "desvio_amostral", label: "Desvio Padrão (Amostral)" },
    { value: "desvio_populacional", label: "Desvio Padrão (Populacional)" },
    { value: "variancia_amostral", label: "Variância (Amostral)" },
    { value: "variancia_populacional", label: "Variância (Populacional)" },
    { value: "normal_pdf", label: "Distribuição Normal (PDF)" },
    { value: "normal_cdf", label: "Distribuição Normal (CDF)" },
    { value: "binomial_pdf", label: "Distribuição Binomial (PDF)" },
    { value: "binomial_cdf", label: "Distribuição Binomial (CDF)" },
    { value: "combinacao", label: "Combinação ( C(n,k) )" },
    { value: "permutacao", label: "Permutação ( P(n,k) )" },
    { value: "regressao_linear", label: "Regressão Linear Simples" }
  ];

  const needsDados = ["media", "mediana", "moda", "desvio_amostral", "desvio_populacional", "variancia_amostral", "variancia_populacional"].includes(task);
  const needsNormal = ["normal_pdf", "normal_cdf"].includes(task);
  const needsBinomial = ["binomial_pdf", "binomial_cdf"].includes(task);
  const needsCombinatoria = ["combinacao", "permutacao"].includes(task);
  const needsRegressao = task === "regressao_linear";

  function parseList(str: string): number[] {
    return str.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  }

  async function handleSubmit() {
    setLoading(true);
    setEngineResult(null);

    const payload: any = { operacao: task };

    if (needsDados) payload.dados = parseList(dados);
    if (needsNormal) {
      payload.media = Number(normMedia);
      payload.desvio = Number(normDesvio);
      payload.x = Number(normX);
    }
    if (needsBinomial) {
      payload.n = Number(binN);
      payload.k = Number(binK);
      payload.p = Number(binP);
    }
    if (needsCombinatoria) {
      payload.n = Number(binN);
      payload.k = Number(binK);
    }
    if (needsRegressao) {
      payload.xDados = parseList(xDados);
      payload.yDados = parseList(yDados);
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/estatistica/calcular`, {
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
        if (data.resultado !== undefined && data.result === undefined) {
          if (typeof data.resultado === 'object' && data.resultado !== null) {
            const interm = Object.entries(data.resultado).map(([k, v]) => ({
              symbol: k,
              name: k,
              value: String(v)
            }));
            setEngineResult({
              result: "Sumário",
              intermediateResults: interm,
              calculationSteps: data.equacao ? [{ index: 1, description: "Equação", formula: data.equacao }] : undefined
            });
          } else if (Array.isArray(data.resultado)) {
            setEngineResult({
              result: data.resultado.join(", "),
              calculationSteps: data.equacao ? [{ index: 1, description: "Equação", formula: data.equacao }] : undefined
            });
          } else {
            setEngineResult({
              result: String(data.resultado),
              calculationSteps: data.equacao ? [{ index: 1, description: "Equação", formula: data.equacao }] : undefined
            });
          }
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
      <SectionHeader title="Estatística e Probabilidade" subtitle="Módulo: Estatística" />

      <Card>
        <CardHeader>
          <Select 
            label="Tarefa" 
            value={task} 
            onChange={e => setTask(e.target.value as EstatisticaTask)} 
            options={taskOptions}
          />
        </CardHeader>
        
        <CardContent className="flex flex-col gap-[var(--spacing-md)]">
          {needsDados && (
            <Input 
              label="Conjunto de Dados (separados por vírgula)" 
              value={dados} 
              onChange={e => setDados(e.target.value)} 
              placeholder="Ex: 10, 20, 30.5"
            />
          )}

          {needsNormal && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-md)]">
              <Input label="Média (μ)" type="number" step="any" value={normMedia} onChange={e => setNormMedia(Number(e.target.value))} />
              <Input label="Desvio (σ)" type="number" step="any" value={normDesvio} onChange={e => setNormDesvio(Number(e.target.value))} />
              <Input label="Valor (x)" type="number" step="any" value={normX} onChange={e => setNormX(Number(e.target.value))} />
            </div>
          )}

          {(needsBinomial || needsCombinatoria) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-md)]">
              <Input label="N (Total)" type="number" value={binN} onChange={e => setBinN(Number(e.target.value))} />
              <Input label="K (Sucessos/Escolhas)" type="number" value={binK} onChange={e => setBinK(Number(e.target.value))} />
              {needsBinomial && (
                <Input label="Prob. (p)" type="number" step="any" min="0" max="1" value={binP} onChange={e => setBinP(Number(e.target.value))} />
              )}
            </div>
          )}

          {needsRegressao && (
            <div className="flex flex-col gap-[var(--spacing-md)]">
              <Input label="Valores de X" value={xDados} onChange={e => setXDados(e.target.value)} />
              <Input label="Valores de Y" value={yDados} onChange={e => setYDados(e.target.value)} />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="justify-end bg-[var(--color-surface-elevated)]/30">
          <Button variant="secondary" onClick={() => { setDados(""); setXDados(""); setYDados(""); setEngineResult(null); }}>
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
