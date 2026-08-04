// ===========================================================
// CALCULATOR CAPABILITIES — Cada calculadora declara o que
// suporta. A UI usa isso para saber o que renderizar.
// ===========================================================

export type Capability =
  | 'STEP_BY_STEP'
  | 'GRAPH'
  | 'PDF_EXPORT'
  | 'MEMORIAL'
  | 'UNIT_CONVERSION'
  | 'SIMULATION'
  | 'AI_INTERPRETATION'
  | 'HISTORY'
  | 'NORMATIVE_VERSION';

export interface CalculatorMeta {
  id: string;
  name: string;
  description: string;
  pluginArea: 'matematica' | 'fisica' | 'engenharia' | 'ferramentas';
  disciplineIds: string[];  // Quais disciplinas do PPC usam esta calc
  capabilities: Capability[];
  knowledgeFormulaIds?: string[]; // Fórmulas vinculadas da Knowledge Base
  normativeRef?: string;          // Ex: "NBR 6118:2014"
  version: string;
}
