import { useState } from "react";
import type { EngineResult } from "../core/types/engine";
import { EngineResultView } from "./engine/EngineResultView";
import { Card, CardContent, CardHeader, CardFooter, Button, Select, SectionHeader} from "./ui";

type MatrizesTask = 
  | "somaMatriz" | "subtracaoMatriz" | "multiplicacaoMatriz" 
  | "determinante" | "inversa" | "transposta" 
  | "autovalores" | "autovetores"
  | "produtoEscalar" | "produtoVetorial" | "norma" 
  | "resolverSistema";

export function MatrizesForm() {
  const [task, setTask] = useState<MatrizesTask>("somaMatriz");
  const [loading, setLoading] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);

  // States for Matrix A
  const [rowsA, setRowsA] = useState(3);
  const [colsA, setColsA] = useState(3);
  const [matA, setMatA] = useState<number[][]>(Array(10).fill(0).map(() => Array(10).fill(0)));

  // States for Matrix B
  const [rowsB, setRowsB] = useState(3);
  const [colsB, setColsB] = useState(3);
  const [matB, setMatB] = useState<number[][]>(Array(10).fill(0).map(() => Array(10).fill(0)));

  // States for Vector U
  const [sizeU, setSizeU] = useState(3);
  const [vecU, setVecU] = useState<number[]>(Array(10).fill(0));

  // States for Vector V
  const [sizeV, setSizeV] = useState(3);
  const [vecV, setVecV] = useState<number[]>(Array(10).fill(0));

  const taskOptions = [
    { value: "somaMatriz", label: "Soma de Matrizes (A + B)" },
    { value: "subtracaoMatriz", label: "Subtração de Matrizes (A - B)" },
    { value: "multiplicacaoMatriz", label: "Multiplicação de Matrizes (A * B)" },
    { value: "determinante", label: "Determinante (Det A)" },
    { value: "inversa", label: "Matriz Inversa (A^-1)" },
    { value: "transposta", label: "Matriz Transposta (A^T)" },
    { value: "autovalores", label: "Autovalores" },
    { value: "autovetores", label: "Autovetores" },
    { value: "produtoEscalar", label: "Produto Escalar (u . v)" },
    { value: "produtoVetorial", label: "Produto Vetorial (u x v)" },
    { value: "norma", label: "Norma de Vetor (||u||)" },
    { value: "resolverSistema", label: "Resolver Sistema (A x = v)" }
  ];

  const needsMatA = ["somaMatriz", "subtracaoMatriz", "multiplicacaoMatriz", "determinante", "inversa", "transposta", "autovalores", "autovetores", "resolverSistema"].includes(task);
  const needsMatB = ["somaMatriz", "subtracaoMatriz", "multiplicacaoMatriz"].includes(task);
  const needsVecU = ["produtoEscalar", "produtoVetorial", "norma"].includes(task);
  const needsVecV = ["produtoEscalar", "produtoVetorial", "resolverSistema"].includes(task);

  function getActiveMatA() { return matA.slice(0, rowsA).map(r => r.slice(0, colsA)); }
  function getActiveMatB() { return matB.slice(0, rowsB).map(r => r.slice(0, colsB)); }
  function getActiveVecU() { return vecU.slice(0, sizeU); }
  function getActiveVecV() { return vecV.slice(0, task === "resolverSistema" ? rowsA : sizeV); } // for system, v size must be equal to rows of A

  function formatResult(res: string) {
    if (!res) return "";
    let formatted = res.replace(/\{\s*\{/g, "[\n  [").replace(/\}\s*\}/g, "]\n]").replace(/\},\s*\{/g, "],\n  [");
    if (formatted === res) {
      formatted = res.replace(/\{/g, "[").replace(/\}/g, "]");
    }
    return formatted;
  }

  async function handleSubmit() {
    setLoading(true); setEngineResult(null);
    const payload: any = { operacao: task };
    if (needsMatA) payload.matrizA = getActiveMatA();
    if (needsMatB) payload.matrizB = getActiveMatB();
    if (needsVecU) payload.vetorU = getActiveVecU();
    if (needsVecV) payload.vetorV = getActiveVecV();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/matrizes/calcular`, {
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
             result: "Matriz/Vetor Resultante",
             calculationSteps: [{ index: 1, description: "Resultado Formatado", formula: formatResult(String(data.resultado)) }]
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
      <SectionHeader title="Matrizes e Vetores" subtitle="Álgebra Linear" />

      <Card>
        <CardHeader>
          <Select label="Operação" value={task} onChange={e => setTask(e.target.value as MatrizesTask)} options={taskOptions} />
        </CardHeader>
        
        <CardContent className="flex flex-col gap-[var(--spacing-md)]">
          {needsMatA && <MatrixInput label="Matriz A" rows={rowsA} cols={colsA} onRowsChange={setRowsA} onColsChange={setColsA} data={matA} onDataChange={setMatA} />}
          {needsMatB && <MatrixInput label="Matriz B" rows={rowsB} cols={colsB} onRowsChange={setRowsB} onColsChange={setColsB} data={matB} onDataChange={setMatB} />}
          {needsVecU && <VectorInput label="Vetor u" size={sizeU} onSizeChange={setSizeU} data={vecU} onDataChange={setVecU} />}
          {needsVecV && <VectorInput label={task === "resolverSistema" ? "Vetor B (Resultado)" : "Vetor v"} size={task === "resolverSistema" ? rowsA : sizeV} onSizeChange={task === "resolverSistema" ? () => {} : setSizeV} data={vecV} onDataChange={setVecV} fixedSize={task === "resolverSistema"} />}
        </CardContent>

        <CardFooter className="justify-end bg-[var(--color-surface-elevated)]/30">
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Computando..." : "Computar"}</Button>
        </CardFooter>
      </Card>

      {engineResult && <EngineResultView result={engineResult} />}
    </div>
  );
}

function MatrixInput({ label, rows, cols, onRowsChange, onColsChange, data, onDataChange }: any) {
  return (
    <div className="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)]/30 pb-2">
        <span className="font-label-caps text-[var(--color-text-primary)] text-sm uppercase tracking-widest">{label}</span>
        <div className="flex gap-[var(--spacing-sm)]">
          <div className="flex items-center gap-[var(--spacing-xs)]">
            <label className="text-[10px] font-mono-code text-[var(--color-text-secondary)] uppercase">Linhas:</label>
            <input type="number" min="1" max="10" value={rows} onChange={e => onRowsChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} className="w-12 h-8 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-center text-[var(--color-text-primary)] font-mono-data focus:border-[var(--color-primary)] outline-none" />
          </div>
          <div className="flex items-center gap-[var(--spacing-xs)]">
            <label className="text-[10px] font-mono-code text-[var(--color-text-secondary)] uppercase">Colunas:</label>
            <input type="number" min="1" max="10" value={cols} onChange={e => onColsChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} className="w-12 h-8 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-center text-[var(--color-text-primary)] font-mono-data focus:border-[var(--color-primary)] outline-none" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar mt-2">
        <div className="grid gap-[var(--spacing-xs)]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array(rows).fill(0).map((_, r) => (
            Array(cols).fill(0).map((_, c) => (
              <input
                key={`${r}-${c}`} type="number" value={data[r][c] || ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  const newData = [...data];
                  newData[r] = [...newData[r]];
                  newData[r][c] = val;
                  onDataChange(newData);
                }}
                className="w-16 h-10 text-center bg-[var(--color-bg)] border border-[var(--color-border)] rounded font-mono-data text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none"
                placeholder="0"
              />
            ))
          ))}
        </div>
      </div>
    </div>
  );
}

function VectorInput({ label, size, onSizeChange, data, onDataChange, fixedSize }: any) {
  return (
    <div className="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)]/30 pb-2">
        <span className="font-label-caps text-[var(--color-text-primary)] text-sm uppercase tracking-widest">{label}</span>
        {!fixedSize && (
          <div className="flex items-center gap-[var(--spacing-xs)]">
            <label className="text-[10px] font-mono-code text-[var(--color-text-secondary)] uppercase">Tamanho:</label>
            <input type="number" min="1" max="10" value={size} onChange={e => onSizeChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} className="w-12 h-8 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-center text-[var(--color-text-primary)] font-mono-data focus:border-[var(--color-primary)] outline-none" />
          </div>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar mt-2">
        <div className="flex gap-[var(--spacing-xs)]">
          {Array(size).fill(0).map((_, i) => (
            <input
              key={i} type="number" value={data[i] || ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                const newData = [...data]; newData[i] = val; onDataChange(newData);
              }}
              className="w-16 h-10 text-center bg-[var(--color-bg)] border border-[var(--color-border)] rounded font-mono-data text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none"
              placeholder="0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
