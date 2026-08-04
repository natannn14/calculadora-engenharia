// ===========================================================
// KNOWLEDGE ENTITIES — O contrato das entidades do banco de
// conhecimento. Independente de onde os dados são lidos
// (JSON local, PostgreSQL, API), a estrutura é a mesma.
// ===========================================================

export interface Reference {
  title: string;
  author?: string;
  year?: number;
  standard?: string;  // Ex: "NBR 6118"
  url?: string;
}

export interface VariableDefinition {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface NormativeReference {
  standard: string;   // Ex: "NBR 6118"
  version: string;    // Ex: "2014"
  validFrom: string;  // ISO 8601
  obsoleteFrom?: string;
}

export interface KnowledgeFormula {
  id: string;
  name: string;
  category: string;       // Ex: "Resistência dos Materiais"
  discipline: string;     // Ex: "Mecânica dos Sólidos"
  equationLaTeX: string;  // Para renderizar com KaTeX/MathJax
  description: string;
  variables: VariableDefinition[];
  units: string;          // Unidade SI de saída
  hypotheses: string[];
  limitations: string[];
  applications: string[];
  commonErrors: string[];
  relatedEntityIds: string[]; // Relacionamentos no Knowledge Graph
  normativeRef?: NormativeReference;
  references: Reference[];
  version: string;
  validFrom: string;
  obsoleteFrom?: string;
}

export interface KnowledgeConstant {
  id: string;
  name: string;
  symbol: string;
  value: number;
  unit: string;
  description: string;
  category: 'FISICA' | 'MATEMATICA' | 'ENGENHARIA' | 'QUIMICA';
  relatedArea: string[];
}

export interface KnowledgeMaterial {
  id: string;
  name: string;
  category: string;         // Aço, Concreto, Madeira...
  properties: Record<string, { value: number; unit: string }>;
  normativeRef?: NormativeReference;
  references: Reference[];
}
