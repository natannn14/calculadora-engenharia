import React, { useState } from "react";
import type { BeamRequest } from "../beamTypes";
import type { EngineResult } from "../core/types/engine";
import { EngineResultView } from "./engine/EngineResultView";
import { Card, CardContent, CardHeader, CardFooter, Button, Input, SectionHeader } from "./ui";

export function BeamForm() {
  const [span, setSpan] = useState(6);
  const [load, setLoad] = useState(10);
  const [loading, setLoading] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setEngineResult(null);

    const payload: BeamRequest = {
      span: { value: span, unit: "m" },
      load: { value: load, unit: "kN/m" },
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/templates/beam`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (data.warnings) {
           setEngineResult(data);
        } else {
           // Fallback to error structure just in case backend fails unexpectedly
           setEngineResult({
             result: "Erro",
             warnings: [{ code: "HTTP_ERROR", message: data.error || `Erro HTTP: ${res.status}`, severity: "ERROR" }]
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
    <div className="flex flex-col gap-[var(--spacing-lg)] w-full max-w-5xl mx-auto">
      <SectionHeader title="Engenharia Estrutural" subtitle="Viga Bi-apoiada (w)" />

      <Card>
        <CardHeader>
          <h3 className="font-mono-code text-[var(--color-text-secondary)] text-[var(--font-size-small)] uppercase tracking-widest">Esquemático</h3>
        </CardHeader>
        <CardContent className="bg-[var(--color-surface-elevated)]/50">
          <BeamSchematic span={span} load={load} />
        </CardContent>
        <CardContent className="flex flex-col sm:flex-row gap-[var(--spacing-md)] pt-[var(--spacing-md)] border-t border-[var(--color-border)]/30">
          <Input label="Comprimento L (m)" type="number" step="0.01" min="0.01" value={span} onChange={(e) => setSpan(parseFloat(e.target.value) || 0)} />
          <Input label="Carga w (kN/m)" type="number" step="0.01" min="0.01" value={load} onChange={(e) => setLoad(parseFloat(e.target.value) || 0)} />
        </CardContent>
        <CardFooter className="justify-end bg-[var(--color-surface-elevated)]/30">
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Calculando..." : "Calcular Viga"}</Button>
        </CardFooter>
      </Card>

      {engineResult && <EngineResultView result={engineResult} />}
    </div>
  );
}

function BeamSchematic({ span, load }: { span: number; load: number }) {
  const w = 400; const h = 120; const margin = 48; const beamY = 72; const beamLeft = margin; const beamRight = w - margin; const beamLen = beamRight - beamLeft;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxHeight: 140 }} aria-label="Esquema da viga bi-apoiada" className="mt-[var(--spacing-md)]">
      <line x1={beamLeft} y1={beamY} x2={beamRight} y2={beamY} stroke="var(--color-text-primary)" strokeWidth="3" />
      <polygon points={`${beamLeft},${beamY} ${beamLeft - 11},${beamY + 20} ${beamLeft + 11},${beamY + 20}`} fill="var(--color-secondary)" opacity="0.9" />
      <polygon points={`${beamRight},${beamY} ${beamRight - 11},${beamY + 20} ${beamRight + 11},${beamY + 20}`} fill="var(--color-secondary)" opacity="0.9" />
      {Array.from({ length: 10 }, (_, i) => {
        const x = beamLeft + (beamLen / 10) * (i + 0.5);
        return (
          <g key={i}>
            <line x1={x} y1={beamY - 28} x2={x} y2={beamY - 5} stroke="var(--color-danger)" strokeWidth="1.5" />
            <polygon points={`${x},${beamY - 5} ${x - 3},${beamY - 11} ${x + 3},${beamY - 11}`} fill="var(--color-danger)" />
          </g>
        );
      })}
      <line x1={beamLeft} y1={beamY - 28} x2={beamRight} y2={beamY - 28} stroke="var(--color-danger)" strokeWidth="1.5" />
      <text x={w / 2} y={beamY + 42} textAnchor="middle" fontSize="11" fill="var(--color-text-secondary)" className="font-mono-data">L = {span} m</text>
      <text x={w / 2} y={beamY - 36} textAnchor="middle" fontSize="11" fill="var(--color-danger)" className="font-mono-data">w = {load} kN/m</text>
      <text x={beamLeft} y={beamY + 42} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-secondary)" className="font-mono-code">A</text>
      <text x={beamRight} y={beamY + 42} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-secondary)" className="font-mono-code">B</text>
    </svg>
  );
}
