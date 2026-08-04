// Arquivo de internacionalização pt-BR
// Para adicionar novo idioma: copie este arquivo, renomeie e traduza.
export const ptBR = {
  app: {
    name: 'CalculaEng',
    tagline: 'Engineering Toolkit',
  },
  nav: {
    matematica: 'Matemática',
    fisica: 'Física',
    engenharia: 'Engenharia',
    ferramentas: 'Ferramentas',
    biblioteca: 'Biblioteca',
    configuracoes: 'Configurações',
  },
  modes: {
    student: 'Modo Estudante',
    professional: 'Modo Profissional',
    teacher: 'Modo Professor',
  },
  calculator: {
    summary: 'Resumo',
    inputs: 'Entradas',
    result: 'Resultado',
    formulas: 'Fórmulas',
    variables: 'Variáveis',
    steps: 'Passo a Passo',
    commonErrors: 'Erros Comuns',
    references: 'Referências',
    assumptions: 'Hipóteses',
    warnings: 'Avisos',
  },
} as const;

export type I18nKeys = typeof ptBR;
