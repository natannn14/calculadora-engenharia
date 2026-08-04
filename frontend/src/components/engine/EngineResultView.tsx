import React, { useState } from 'react';
import type { EngineResult, EngineWarning, EngineStep } from '../../core/types/engine';
import { AlertTriangle, Info, XCircle, ChevronDown, ChevronUp, BookOpen, Activity } from 'lucide-react';

interface EngineResultViewProps {
  result: EngineResult;
}

const WarningCard: React.FC<{ warning: EngineWarning }> = ({ warning }) => {
  const isError = warning.severity === 'ERROR';
  const isWarning = warning.severity === 'WARNING';
  
  const bgClass = isError ? 'bg-red-900/20 border-red-500/50 text-red-200' 
                : isWarning ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-200'
                : 'bg-blue-900/20 border-blue-500/50 text-blue-200';
  
  const Icon = isError ? XCircle : isWarning ? AlertTriangle : Info;
  const iconColor = isError ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-blue-400';

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-sm flex items-start space-x-3 mb-4 shadow-lg ${bgClass}`}>
      <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${iconColor}`} />
      <div>
        <h4 className="font-semibold">{warning.code || warning.severity}</h4>
        <p className="text-sm opacity-90">{warning.message}</p>
      </div>
    </div>
  );
};

const StepAccordion: React.FC<{ steps: EngineStep[] }> = ({ steps }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-8 border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-gray-100">Passo a Passo do Cálculo</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4">
          {steps.map((step) => (
            <div key={step.index} className="flex space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                {step.index}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-200 text-sm leading-relaxed">{step.description}</p>
                {step.formula && (
                  <div className="mt-2 p-3 bg-black/40 rounded-lg font-mono text-xs text-emerald-300 overflow-x-auto">
                    {step.formula}
                  </div>
                )}
                {step.intermediateValue && (
                  <p className="mt-1 text-sm text-gray-400">
                    Resultado parcial: <span className="text-white">{step.intermediateValue}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EngineResultView: React.FC<EngineResultViewProps> = ({ result }) => {
  const errors = result.warnings?.filter(w => w.severity === 'ERROR') || [];
  const otherWarnings = result.warnings?.filter(w => w.severity !== 'ERROR') || [];

  // Renderiza alertas de erro crítico
  if (errors.length > 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {errors.map((error, idx) => (
          <WarningCard key={idx} warning={error} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Avisos Não-Críticos */}
      {otherWarnings.length > 0 && (
        <div className="space-y-3">
          {otherWarnings.map((warning, idx) => (
            <WarningCard key={idx} warning={warning} />
          ))}
        </div>
      )}

      {/* Resultado Principal */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-black/60 to-emerald-950/30 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] backdrop-blur-xl relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
        <h2 className="text-sm font-medium text-emerald-400/80 uppercase tracking-widest mb-2">Resultado Final</h2>
        <div className="flex items-baseline justify-center space-x-3 flex-wrap">
          <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {result.result}
          </span>
          {result.resultUnit && (
            <span className="text-2xl text-emerald-400 font-semibold">{result.resultUnit}</span>
          )}
        </div>
        
        {/* Integração Knowledge Base */}
        {result.usedFormulaId && (
          <button 
            onClick={() => console.log('Abrir fórmula:', result.usedFormulaId)}
            className="mt-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all text-sm group"
          >
            <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Ver detalhes da fórmula na Biblioteca</span>
          </button>
        )}
      </div>

      {/* Resultados Intermediários */}
      {result.intermediateResults && result.intermediateResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {result.intermediateResults.map((ir, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors flex flex-col items-center justify-center text-center group">
              <span className="text-xs font-semibold text-gray-400 group-hover:text-emerald-400 transition-colors mb-1">{ir.name || ir.symbol}</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-gray-100">{ir.value}</span>
                {ir.unit && <span className="text-sm text-emerald-400">{ir.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gráficos (Mocks/Placeholders) */}
      {result.graphs && result.graphs.length > 0 && (
        <div className="space-y-4">
          {result.graphs.map((graph, idx) => (
            <div key={idx} className="p-8 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center min-h-[250px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {graph.type === 'BEAM_DIAGRAM' ? (
                <>
                  <div className="w-32 h-1 bg-emerald-500/50 rounded-full mb-4 relative">
                    <div className="absolute top-0 left-0 w-2 h-4 bg-gray-400 -translate-y-1/2"></div>
                    <div className="absolute top-0 right-0 w-2 h-4 bg-gray-400 -translate-y-1/2"></div>
                    <div className="absolute top-0 left-1/2 w-4 h-8 border-r-2 border-t-2 border-red-500 -translate-y-full -translate-x-1/2 opacity-70"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200">Diagrama de Viga</h3>
                  <p className="text-sm text-gray-500 mt-2">(Renderização visual em desenvolvimento)</p>
                </>
              ) : (
                <p className="text-gray-400">Gráfico do tipo {graph.type} (Em breve)</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Accordion de Passo a Passo */}
      <StepAccordion steps={result.calculationSteps || []} />

      {/* Hipóteses e Referências (Rodapé) */}
      {(result.assumptions?.length || result.references?.length) ? (
        <div className="grid md:grid-cols-2 gap-6 mt-8 p-6 rounded-xl bg-black/20 border border-white/5 text-sm">
          {result.assumptions && result.assumptions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-400 mb-3 uppercase tracking-wider text-xs">Hipóteses Adotadas</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-300/80">
                {result.assumptions.map((assump, idx) => (
                  <li key={idx}>{assump}</li>
                ))}
              </ul>
            </div>
          )}
          {result.references && result.references.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-400 mb-3 uppercase tracking-wider text-xs">Referências</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-300/80">
                {result.references.map((ref, idx) => (
                  <li key={idx}>{ref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
