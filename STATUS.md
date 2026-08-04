# Status do Projeto (CalculaEng — Engineering Toolkit)

Este documento registra o estado atual do repositório. Atualizar a cada tarefa importante concluída.

---

## 1. Módulos Implementados

### 📐 Matemática
| Calculadora            | Backend Controller              | Frontend Route               | Status |
|------------------------|---------------------------------|------------------------------|--------|
| Básica                 | CalculadoraBasicaController     | `/matematica/basico`         | ✅ OK  |
| Científica             | CalculadoraCientificaController | `/matematica/cientifico`     | ✅ OK  |
| Álgebra e Equações     | AlgebraController               | `/matematica/algebra`        | ✅ OK  |
| Cálculo Dif. e Integ.  | CalculadoraController           | `/matematica/calculo`        | ✅ OK  |
| Matrizes e Vetores     | MatrizesController              | `/matematica/matrizes`       | ✅ OK  |
| Números Complexos      | ComplexosController             | `/matematica/complexos`      | ✅ OK  |
| Estatística            | EstatisticaController           | `/matematica/estatistica`    | ✅ OK  |

### ⚛️ Física
| Calculadora     | Status           |
|-----------------|------------------|
| Cinemática      | 🔲 Planejada     |
| Termodinâmica   | 🔲 Planejada     |

### 🏗️ Engenharia
| Calculadora            | Backend Controller | Frontend Route               | Status |
|------------------------|--------------------|------------------------------|--------|
| Vigas Bi-apoiadas      | BeamController     | `/engenharia/vigas`          | ✅ OK  |

---

## 2. Arquitetura (Engineering Toolkit — v0.1)

### Camadas da Aplicação
```
UI (React + Design System Omnitrix)
  ↓
Features (Formulários/Views dos módulos)
  ↓
[Visualization — infraestrutura preparada]
  ↓
Engine (Backend Spring Boot — cálculos puros)
  ↓
Knowledge (JSON/Markdown local — Fórmulas, Constantes, Materiais)
  ↓
Repository (Abstração da fonte de dados — substituível)
  ↓
Database (PostgreSQL — pronto para migração futura)
```

### Princípios do Produto
Todo cálculo deve:
- Ser tecnicamente correto.
- Ensinar enquanto calcula.
- Explicar suas hipóteses.
- Mostrar referências.
- Facilitar a vida do estudante.
- Continuar útil para o engenheiro profissional.

### Frontend (React + TypeScript + Vite)
- **Roteamento:** `react-router-dom` — URLs semânticas (`/matematica/calculo`, `/engenharia/vigas`).
- **Code Splitting:** `React.lazy()` — cada módulo é um chunk JS separado.
- **Design System:** Tema Omnitrix como identidade principal, via CSS tokens (`--color-*`).
- **Contexto:** `UserModeContext` — controla Modo Estudante / Profissional / Professor (futuro).
- **i18n:** Infraestrutura preparada em `core/i18n/pt-BR.ts`.
- **Plugin Registry:** `plugins/matematica/index.ts`, `plugins/engenharia/index.ts`, `plugins/fisica/index.ts`.
- **Knowledge Base:** `knowledge/formulas/`, `knowledge/constants/`, `knowledge/materials/` (JSON local — MVP).
- **Repository Layer:** `repository/index.ts` — abstração do acesso a dados (substituível por API REST).

### Backend (Spring Boot)
- **Padrão:** DTO + `@Valid` + `GlobalExceptionHandler` centralizado.
- **Pacote:** Todos os controllers em `controller/` (unificado).
- **`EngineResult`:** Contrato rico de retorno definido em `core/types/engine.ts` (TypeScript) — backend deve evoluir o retorno para este formato.

### Modos de Navegação
- **Modo Profissional:** Acesso direto à ferramenta desejada.
- **Modo Estudante:** Trilha filtrada pelo PPC do curso (Engenharia Civil, Elétrica, etc.) sem duplicação de módulos.
- **Modo Professor (futuro v1.0):** Compartilhamento de listas e exercícios.

---

## 3. Roadmap de Versões

### v0.1 — Base (Fase Atual)
- [x] Design System (Omnitrix Premium — Glassmorphism, animações, tokens CSS)
- [x] 7 calculadoras de Matemática + 1 de Engenharia (8 total)
- [x] Mobile First + Menu Mobile (MobileNav + MobileMenu)
- [x] Roteamento com `react-router-dom`
- [x] Code-splitting automático (lazy loading por módulo)
- [x] Arquitetura de Plugins (`plugins/`, `core/`, `knowledge/`, `repository/`)
- [x] Infraestrutura de i18n (pt-BR)
- [x] Contexto de Modo de Usuário (`UserModeContext`)
- [x] Knowledge Base inicial (1 fórmula, 5 constantes, 2 materiais)
- [ ] PWA (manifest.json + service worker) — próxima tarefa

### v0.2 — Biblioteca de Fórmulas
- [ ] UI da Biblioteca (busca, filtro por disciplina, renderização LaTeX com KaTeX)
- [ ] Expandir `knowledge/formulas/` com 20+ fórmulas por módulo

### v0.3 — Passo a Passo Enriquecido
- [ ] Todos os engines do backend retornando `calculationSteps[]`
- [ ] Componente `StepsAccordion` integrado a todos os formulários

### v0.4 — Conversor de Unidades Inteligente
- [ ] `UnitConverterService` no backend
- [ ] Hook `useUnitConverter()` acoplado aos inputs

### v0.5 — Constantes e Materiais
- [ ] UI de Constantes físicas e matemáticas (com busca)
- [ ] UI de Materiais (aço, concreto, madeira) com propriedades e normas

### v0.6 — Visualization Layer
- [ ] Componente `GraphRenderer` para diagramas de vigas, gráficos e vetores
- [ ] Integração com `EngineGraph[]` no retorno dos engines

### v0.7 — Sistema de Capacidades (Capabilities)
- [ ] Cada calculadora declarando suas `capabilities` no plugin registry
- [ ] UI adaptativa baseada nas capabilities declaradas

### v1.0 — Engineering Assistant
- [ ] Histórico de cálculos persistente
- [ ] Exportação PDF / Memorial Descritivo
- [ ] IA para interpretação do resultado ("O que significa 15 MPa?")
- [ ] Versionamento de normas (NBR 6118:2014 vs 2025)
- [ ] Modo Professor

---

## 4. Padrões de Código Estabelecidos

### Backend
- **Validação:** DTO + `@Valid` no Controller.
- **Exceções:** `GlobalExceptionHandler` centralizado.
- **Pacotes:** `controller/`, `service/`, `dto/`.

### Frontend
- **Componentes UI:** `components/ui/` (Card, Input, Select, Button, Badge, SectionHeader).
- **Layout:** `components/layout/` (Layout, Sidebar, MobileNav, MobileMenu).
- **Camadas:** `core/` | `plugins/` | `knowledge/` | `repository/` | `features/` | `components/`.
- **Estilos:** Tailwind v4 + CSS tokens `--color-*`, `--spacing-*`, `--font-size-*`.

---

## 5. Débitos Técnicos Restantes

- [ ] PWA: `manifest.json`, `vite-plugin-pwa`, service worker.
- [ ] Expandir Knowledge Base (mais fórmulas, constantes, materiais).
- [ ] Backend: Retorno rico (`EngineResult`) para todos os controllers.
- [ ] Testes unitários para BeamService, MatrizesService, EstatisticaService.
- [ ] UI para Biblioteca de Fórmulas e Constantes.
