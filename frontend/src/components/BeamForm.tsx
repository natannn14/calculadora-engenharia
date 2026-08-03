import { useState } from "react";
import type { BeamRequest, BeamResponse } from "../beamTypes";
import { StepsAccordion } from "./StepsAccordion";

export function BeamForm() {
  const [span, setSpan] = useState(6);
  const [load, setLoad] = useState(10);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<BeamResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const payload: BeamRequest = {
      span: { value: span, unit: "m" },
      load: { value: load, unit: "kN/m" },
    };

    try {
      const res = await fetch("http://localhost:8080/api/templates/beam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `Erro HTTP: ${res.status}` }));
        throw new Error(errData.error || `Erro HTTP: ${res.status}`);
      }

      const data: BeamResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Erro ao comunicar com o backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full">
      {/* Esquerda: Configuração da Viga */}
      <div className="col-span-1 lg:col-span-6 flex flex-col gap-lg h-auto lg:h-full">
        
        {/* Header Section */}
        <div className="flex items-baseline justify-between w-full border-b border-surface-tint pb-sm mb-sm relative flex-wrap gap-sm">
          <div className="absolute -bottom-[1px] left-0 w-1/3 h-[2px] bg-secondary shadow-[0_0_8px_var(--tw-shadow-color)] shadow-secondary"></div>
          <div>
            <h1 className="font-display text-[32px] md:text-[40px] text-on-surface tracking-tight uppercase leading-none">
              Modelos de Eng.
            </h1>
            <p className="font-mono-data text-[12px] md:text-mono-data text-secondary mt-xs opacity-80">
              TEMPLATE: Viga Bi-apoiada (w)
            </p>
          </div>
        </div>

        {/* ERRO */}
        {error && (
          <div className="bg-error-container/20 border border-error text-error p-md rounded-lg font-mono-data text-sm">
            ⚠ {error}
          </div>
        )}

        <div className="flex flex-col gap-lg">
          {/* ESQUEMÁTICO */}
          <div className="calc-panel bg-surface-container rounded-lg p-md border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-xs bg-surface-container-high rounded-bl text-[10px] font-mono-code text-on-surface-variant uppercase tracking-widest border-b border-l border-outline-variant/50">
              ESQUEMÁTICO
            </div>
            <BeamSchematic span={span} load={load} />
          </div>

          {/* FORM */}
          <div className="calc-panel bg-surface-container rounded-lg p-md border border-outline-variant/30">
            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="grid grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-mono-code text-[11px] text-on-surface-variant uppercase tracking-widest" htmlFor="beam-span">
                    Comprimento L (m)
                  </label>
                  <input
                    id="beam-span"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={span}
                    onChange={(e) => setSpan(parseFloat(e.target.value) || 0)}
                    className="bg-surface border border-outline-variant text-on-surface font-mono-data text-md px-md py-sm rounded outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-mono-code text-[11px] text-on-surface-variant uppercase tracking-widest" htmlFor="beam-load">
                    Carga w (kN/m)
                  </label>
                  <input
                    id="beam-load"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={load}
                    onChange={(e) => setLoad(parseFloat(e.target.value) || 0)}
                    className="bg-surface border border-outline-variant text-on-surface font-mono-data text-md px-md py-sm rounded outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="calc-btn mt-sm bg-secondary/10 border border-secondary text-secondary font-label-caps text-[12px] md:text-label-caps px-md py-sm rounded hover:bg-secondary hover:text-on-secondary transition-all uppercase shadow-[0_0_15px_var(--calc-shadow,rgba(102,252,241,0.15))] flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined mr-sm animate-spin">refresh</span>
                    Calculando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-sm">play_arrow</span>
                    Calcular Viga
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Direita: Resultados e Gráficos */}
      <div className="col-span-1 lg:col-span-6 h-auto flex flex-col relative group">
        
        {/* Linha vertical conectora de decoração */}
        <div className="hidden lg:block absolute -left-[10px] top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-outline-variant to-transparent"></div>
        
        {response ? (
          <div className="flex flex-col gap-lg animate-slideUp">
            
            {/* Cards de reação */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
              <ResultCard label="Reação RA" value={response.reactions.A.value} unit={response.reactions.A.unit} />
              <ResultCard label="Reação RB" value={response.reactions.B.value} unit={response.reactions.B.unit} />
              <ResultCard label="Momento Máx." value={response.maxMoment.value} unit={response.maxMoment.unit} highlight />
              <ResultCard label="Cortante Máx." value={response.maxShear.value} unit={response.maxShear.unit} accent />
            </div>

            {/* Gráficos */}
            <div className="calc-panel bg-surface-container rounded-lg p-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="relative">
                 <div className="absolute top-0 right-0 p-xs text-[10px] font-mono-code text-on-surface-variant uppercase tracking-widest z-10">M(x)</div>
                 <DiagramCanvas
                  positions={response.positions}
                  values={response.momentDiagram}
                  color="var(--color-secondary)"
                  fillColor="rgba(102,252,241,0.15)"
                  label="Momento Fletor (kN·m)"
                />
              </div>
              <div className="h-[1px] w-full bg-outline-variant/30"></div>
              <div className="relative">
                 <div className="absolute top-0 right-0 p-xs text-[10px] font-mono-code text-on-surface-variant uppercase tracking-widest z-10">V(x)</div>
                 <DiagramCanvas
                  positions={response.positions}
                  values={response.shearDiagram}
                  color="var(--color-error)"
                  fillColor="rgba(255,180,171,0.15)"
                  label="Esforço Cortante (kN)"
                />
              </div>
            </div>

            {/* Passos timeline */}
            <StepsAccordion steps={response.steps} />

          </div>
        ) : (
          <div className="calc-panel bg-surface-container h-full rounded-lg flex flex-col items-center justify-center border border-outline-variant/30 text-on-surface-variant opacity-50 min-h-[300px]">
            <span className="material-symbols-outlined text-[48px] mb-md">analytics</span>
            <p className="font-mono-data text-[14px]">Aguardando cálculo...</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ResultCard ─── */

function ResultCard({
  label,
  value,
  unit,
  highlight = false,
  accent = false,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
  accent?: boolean;
}) {
  const borderColor = highlight
    ? "border-secondary"
    : accent
    ? "border-error"
    : "border-outline-variant/30";

  const bgColor = highlight
    ? "bg-secondary/10"
    : accent
    ? "bg-error/10"
    : "bg-surface-container-high";

  const valueColor = highlight
    ? "text-secondary"
    : accent
    ? "text-error"
    : "text-primary";

  return (
    <div className={`calc-panel p-sm md:p-md rounded-lg border ${borderColor} ${bgColor} flex flex-col justify-center items-center text-center`}>
      <p className="font-mono-code text-[10px] text-on-surface-variant uppercase tracking-widest mb-xs">
        {label}
      </p>
      <p className={`font-mono-data text-lg md:text-xl font-bold ${valueColor}`}>
        {value.toFixed(2)}
        <span className="text-xs font-normal opacity-70 ml-1">{unit}</span>
      </p>
    </div>
  );
}

/* ─── BeamSchematic ─── */

function BeamSchematic({ span, load }: { span: number; load: number }) {
  const w = 400;
  const h = 120;
  const margin = 48;
  const beamY = 72;
  const beamLeft = margin;
  const beamRight = w - margin;
  const beamLen = beamRight - beamLeft;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxHeight: 140 }} aria-label="Esquema da viga bi-apoiada" className="mt-md">
      {/* Beam */}
      <line x1={beamLeft} y1={beamY} x2={beamRight} y2={beamY} stroke="var(--color-on-surface)" strokeWidth="3" />

      {/* Support A (triangle) */}
      <polygon
        points={`${beamLeft},${beamY} ${beamLeft - 11},${beamY + 20} ${beamLeft + 11},${beamY + 20}`}
        fill="var(--color-secondary)"
        opacity="0.9"
      />
      {/* Support B (triangle) */}
      <polygon
        points={`${beamRight},${beamY} ${beamRight - 11},${beamY + 20} ${beamRight + 11},${beamY + 20}`}
        fill="var(--color-secondary)"
        opacity="0.9"
      />

      {/* Distributed load arrows */}
      {Array.from({ length: 10 }, (_, i) => {
        const x = beamLeft + (beamLen / 10) * (i + 0.5);
        return (
          <g key={i}>
            <line x1={x} y1={beamY - 28} x2={x} y2={beamY - 5} stroke="var(--color-error)" strokeWidth="1.5" />
            <polygon
              points={`${x},${beamY - 5} ${x - 3},${beamY - 11} ${x + 3},${beamY - 11}`}
              fill="var(--color-error)"
            />
          </g>
        );
      })}

      {/* Load top bar */}
      <line x1={beamLeft} y1={beamY - 28} x2={beamRight} y2={beamY - 28} stroke="var(--color-error)" strokeWidth="1.5" />

      {/* Labels */}
      <text x={w / 2} y={beamY + 42} textAnchor="middle" fontSize="11" fill="var(--color-on-surface-variant)" className="font-mono-data">
        L = {span} m
      </text>
      <text x={w / 2} y={beamY - 36} textAnchor="middle" fontSize="11" fill="var(--color-error)" className="font-mono-data">
        w = {load} kN/m
      </text>
      <text x={beamLeft} y={beamY + 42} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-secondary)" className="font-mono-code">A</text>
      <text x={beamRight} y={beamY + 42} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-secondary)" className="font-mono-code">B</text>
    </svg>
  );
}

/* ─── DiagramCanvas ─── */

function DiagramCanvas({
  positions,
  values,
  color,
  fillColor,
  label,
}: {
  positions: number[];
  values: number[];
  color: string;
  fillColor: string;
  label: string;
}) {
  if (positions.length === 0) return null;

  const w = 500;
  const h = 180;
  const padX = 52;
  const padY = 28;

  const xMin = positions[0];
  const xMax = positions[positions.length - 1];
  const yMin = Math.min(0, ...values);
  const yMax = Math.max(0, ...values);
  const yRange = yMax - yMin || 1;

  function toSvgX(val: number) {
    return padX + ((val - xMin) / (xMax - xMin || 1)) * (w - 2 * padX);
  }
  function toSvgY(val: number) {
    return padY + (1 - (val - yMin) / yRange) * (h - 2 * padY);
  }

  const zeroY = toSvgY(0);
  const linePts = positions.map((p, i) => `${toSvgX(p)},${toSvgY(values[i])}`).join(" ");
  const fillPts = [
    `${toSvgX(positions[0])},${zeroY}`,
    ...positions.map((p, i) => `${toSvgX(p)},${toSvgY(values[i])}`),
    `${toSvgX(positions[positions.length - 1])},${zeroY}`,
  ].join(" ");

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => yMin + (yRange * i) / yTicks);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxHeight: 200 }}>
      {/* Background grid lines */}
      {yTickValues.map((v, i) => (
        <line
          key={`grid-${i}`}
          x1={padX}
          y1={toSvgY(v)}
          x2={w - padX}
          y2={toSvgY(v)}
          stroke="var(--color-outline-variant)"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      ))}

      {/* Zero line */}
      <line x1={padX} y1={zeroY} x2={w - padX} y2={zeroY} stroke="var(--color-on-surface-variant)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="5,3" />

      {/* Fill */}
      <polygon points={fillPts} fill={fillColor} />

      {/* Line */}
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />

      {/* Y ticks */}
      {yTickValues.map((v, i) => (
        <g key={i}>
          <text x={padX - 6} y={toSvgY(v) + 4} textAnchor="end" fontSize="9" fill="var(--color-on-surface-variant)" className="font-mono-code">
            {v.toFixed(1)}
          </text>
          <line x1={padX - 3} y1={toSvgY(v)} x2={padX} y2={toSvgY(v)} stroke="var(--color-outline-variant)" strokeWidth="0.8" />
        </g>
      ))}

      {/* X labels */}
      <text x={padX} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--color-on-surface-variant)" className="font-mono-code">0</text>
      <text x={w - padX} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--color-on-surface-variant)" className="font-mono-code">{xMax.toFixed(1)} m</text>
      <text x={w / 2} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--color-on-surface-variant)" className="font-mono-code">x (m)</text>

      {/* Diagram label */}
      <text x={padX + 10} y={padY + 12} textAnchor="start" fontSize="12" fill={color} className="font-mono-data opacity-70">
        {label}
      </text>
    </svg>
  );
}
