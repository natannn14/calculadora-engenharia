import type { CalculatorMeta } from '../../core/types/capabilities';

export const engenhariaCalculators: CalculatorMeta[] = [
  {
    id: 'calc-vigas',
    name: 'Vigas e Cargas Estruturais',
    description: 'Análise de vigas bi-apoiadas sob carregamentos distribuídos e pontuais.',
    pluginArea: 'engenharia',
    disciplineIds: ['resistencia-materiais', 'estruturas'],
    capabilities: ['STEP_BY_STEP', 'GRAPH', 'MEMORIAL'],
    knowledgeFormulaIds: ['tensao-normal'],
    normativeRef: 'NBR 6118:2014',
    version: '1.0.0',
  },
];
