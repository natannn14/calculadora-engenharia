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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ESQUEMÁTICO */}
      <div className="calc-card" style={{ padding: "1.25rem" }}>
        <p className="field-label" style={{ marginBottom: "0.75rem", textAlign: "center" }}>
          Esquemático — Viga Bi-apoiada
        </p>
        <BeamSchematic span={span} load={load} />
      </div>

      {/* FORM */}
      <div className="calc-card">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="field-label" htmlFor="beam-span">Comprimento L (m)</label>
              <input
                id="beam-span"
                type="number"
                step="0.01"
                min="0.01"
                value={span}
                onChange={(e) => setSpan(parseFloat(e.target.value) || 0)}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="beam-load">Carga w (kN/m)</label>
              <input
                id="beam-load"
                type="number"
                step="0.01"
                min="0.01"
                value={load}
                onChange={(e) => setLoad(parseFloat(e.target.value) || 0)}
                className="field-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-calcular"
            style={{ background: "var(--col-equal)", boxShadow: "0 4px 16px rgba(30,130,30,0.4)" }}
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span>
                Calculando...
              </>
            ) : (
              "▤ Calcular Viga"
            )}
          </button>
        </form>
      </div>

      {/* ERRO */}
      {error && (
        <div className="alert-error" role="alert">⚠ {error}</div>
      )}

      {/* RESULTADOS */}
      {response && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="result-appear">

          {/* Cards de reação */}
          <div className="calc-card">
            <p className="field-label" style={{ marginBottom: "0.85rem" }}>Resultados</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.85rem" }}>
              <ResultCard label="Reação RA" value={response.reactions.A.value} unit={response.reactions.A.unit} />
              <ResultCard label="Reação RB" value={response.reactions.B.value} unit={response.reactions.B.unit} />
              <ResultCard label="Momento Máx." value={response.maxMoment.value} unit={response.maxMoment.unit} highlight />
              <ResultCard label="Cortante Máx." value={response.maxShear.value} unit={response.maxShear.unit} accent />
            </div>
          </div>

          {/* Diagrama de Momento */}
          <div className="calc-card">
            <p className="field-label" style={{ marginBottom: "0.75rem" }}>
              Diagrama de Momento Fletor (kN·m)
            </p>
            <DiagramCanvas
              positions={response.positions}
              values={response.momentDiagram}
              color="var(--col-operator)"
              fillColor="rgba(210,110,0,0.15)"
              label="M(x)"
            />
          </div>

          {/* Diagrama de Cortante */}
          <div className="calc-card">
            <p className="field-label" style={{ marginBottom: "0.75rem" }}>
              Diagrama de Esforço Cortante (kN)
            </p>
            <DiagramCanvas
              positions={response.positions}
              values={response.shearDiagram}
              color="var(--col-clear)"
              fillColor="rgba(180,50,50,0.15)"
              label="V(x)"
            />
          </div>

          {/* Passos */}
          <div className="calc-card">
            <StepsAccordion steps={response.steps} />
          </div>
        </div>
      )}
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
    ? "var(--col-equal)"
    : accent
    ? "var(--col-clear)"
    : "var(--border)";

  const bgColor = highlight
    ? "rgba(30,130,30,0.1)"
    : accent
    ? "rgba(180,50,50,0.1)"
    : "var(--bg-visor)";

  const valueColor = highlight
    ? "var(--col-equal)"
    : accent
    ? "var(--col-clear)"
    : "var(--text-result)";

  return (
    <div
      style={{
        padding: "0.85rem 1rem",
        borderRadius: "8px",
        border: `1px solid ${borderColor}`,
        background: bgColor,
      }}
    >
      <p
        className="field-label"
        style={{ marginBottom: "0.3rem", fontSize: "0.72rem" }}
      >
        {label}
      </p>
      <p style={{ fontSize: "1.6rem", fontWeight: 700, color: valueColor, lineHeight: 1 }}>
        {value.toFixed(2)}
        <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--text-muted)", marginLeft: "4px" }}>
          {unit}
        </span>
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
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxHeight: 140 }} aria-label="Esquema da viga bi-apoiada">
      {/* Beam */}
      <line x1={beamLeft} y1={beamY} x2={beamRight} y2={beamY} stroke="var(--text-primary)" strokeWidth="3" />

      {/* Support A (triangle) */}
      <polygon
        points={`${beamLeft},${beamY} ${beamLeft - 11},${beamY + 20} ${beamLeft + 11},${beamY + 20}`}
        fill="var(--col-equal)"
        opacity="0.9"
      />
      {/* Support B (triangle) */}
      <polygon
        points={`${beamRight},${beamY} ${beamRight - 11},${beamY + 20} ${beamRight + 11},${beamY + 20}`}
        fill="var(--col-equal)"
        opacity="0.9"
      />

      {/* Distributed load arrows */}
      {Array.from({ length: 10 }, (_, i) => {
        const x = beamLeft + (beamLen / 10) * (i + 0.5);
        return (
          <g key={i}>
            <line x1={x} y1={beamY - 28} x2={x} y2={beamY - 5} stroke="var(--col-clear)" strokeWidth="1.5" />
            <polygon
              points={`${x},${beamY - 5} ${x - 3},${beamY - 11} ${x + 3},${beamY - 11}`}
              fill="var(--col-clear)"
            />
          </g>
        );
      })}

      {/* Load top bar */}
      <line x1={beamLeft} y1={beamY - 28} x2={beamRight} y2={beamY - 28} stroke="var(--col-clear)" strokeWidth="1.5" />

      {/* Labels */}
      <text x={w / 2} y={beamY + 42} textAnchor="middle" fontSize="11" fill="var(--text-muted)">
        L = {span} m
      </text>
      <text x={w / 2} y={beamY - 36} textAnchor="middle" fontSize="11" fill="var(--col-clear)">
        w = {load} kN/m
      </text>
      <text x={beamLeft} y={beamY + 42} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--col-equal)">A</text>
      <text x={beamRight} y={beamY + 42} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--col-equal)">B</text>
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
  const h = 200;
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
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxHeight: 220 }}>
      {/* Background grid lines */}
      {yTickValues.map((v, i) => (
        <line
          key={`grid-${i}`}
          x1={padX}
          y1={toSvgY(v)}
          x2={w - padX}
          y2={toSvgY(v)}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}

      {/* Zero line */}
      <line x1={padX} y1={zeroY} x2={w - padX} y2={zeroY} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5,3" />

      {/* Fill */}
      <polygon points={fillPts} fill={fillColor} />

      {/* Line */}
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />

      {/* Y ticks */}
      {yTickValues.map((v, i) => (
        <g key={i}>
          <text x={padX - 6} y={toSvgY(v) + 4} textAnchor="end" fontSize="9" fill="var(--text-muted)">
            {v.toFixed(1)}
          </text>
          <line x1={padX - 3} y1={toSvgY(v)} x2={padX} y2={toSvgY(v)} stroke="var(--text-muted)" strokeWidth="0.8" />
        </g>
      ))}

      {/* X labels */}
      <text x={padX} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)">0</text>
      <text x={w - padX} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)">{xMax.toFixed(1)} m</text>
      <text x={w / 2} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)">x (m)</text>

      {/* Diagram label */}
      <text x={w - padX - 8} y={padY + 12} textAnchor="end" fontSize="12" fontWeight="bold" fill={color}>
        {label}
      </text>
    </svg>
  );
}
