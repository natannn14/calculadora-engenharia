// ===========================================================
// ENGINE RESULT — O contrato central de qualquer calculadora.
// Todo engine deve retornar este formato para que a UI
// saiba o que renderizar sem saber COMO foi calculado.
// ===========================================================

export interface EngineVariable {
  symbol: string;
  name: string;
  value: number | string;
  unit?: string;
  description?: string;
}

export interface EngineStep {
  index: number;
  description: string;
  formula?: string;       // LaTeX
  intermediateValue?: string;
}

export interface EngineGraph {
  type: 'LINE' | 'BAR' | 'SCATTER' | 'BEAM_DIAGRAM' | 'VECTOR' | 'MATRIX';
  data: unknown;          // Cada Visualization handler interpreta o formato
  options?: Record<string, unknown>;
}

export interface EngineWarning {
  code: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface EngineResult {
  result: string | number;        // O valor principal
  resultUnit?: string;            // Unidade do resultado (SI preferido)
  intermediateResults?: EngineVariable[];   // Resultados intermediários
  usedFormulaId?: string;         // ID na Knowledge Base
  calculationSteps?: EngineStep[]; // Passo a passo
  warnings?: EngineWarning[];      // Avisos e limitações
  assumptions?: string[];         // Hipóteses usadas
  references?: string[];          // Referências bibliográficas
  graphs?: EngineGraph[];         // Dados para Visualization
  metadata?: Record<string, unknown>; // Extensível
}
