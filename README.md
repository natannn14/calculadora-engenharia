# CalculaEng — Engineering Assistant

> Plataforma acadêmica de engenharia. Ferramentas técnicas com embasamento científico, referências normativas e explicações passo a passo.

O **CalculaEng** deixou de ser apenas "um monte de calculadoras" para se tornar uma plataforma profissional que acompanha o estudante desde o ciclo básico (Cálculo, Álgebra, Física) até as disciplinas profissionalizantes de Engenharia.

---

## 🧭 Princípios do Produto (Nossa Filosofia)

Todo cálculo realizado pela plataforma deve, obrigatoriamente:
1. **Ser tecnicamente correto** (precisão matemática e física).
2. **Ensinar enquanto calcula** (mostrar o passo a passo da resolução).
3. **Explicar suas hipóteses** (o que foi assumido para o cálculo ser válido).
4. **Mostrar referências** (livros e normas técnicas associadas).
5. **Facilitar a vida do estudante** (interface limpa, sem anúncios ou complexidade desnecessária).
6. **Continuar útil para o engenheiro profissional** (ferramentas precisas e validadas).

---

## 🏛️ Arquitetura do Sistema (Layered Architecture)

O projeto segue uma arquitetura em camadas de nível comercial, permitindo crescimento infinito sem degradação do código:

```text
[ 1 ] UI (React + Tailwind + Tema Omnitrix)
       ↳ Gerencia apenas componentes visuais (botões, inputs, cards padronizados via EngineResultView).
  ↓
[ 2 ] Features (Formulários e Páginas)
       ↳ Onde a UI encontra a lógica de negócio do frontend (React Router).
  ↓
[ 3 ] Visualization (Camada Gráfica)
       ↳ Renderização de gráficos, diagramas de vigas, vetores (SVG/Canvas).
  ↓
[ 4 ] Engine (Backend Spring Boot)
       ↳ Executa os cálculos pesados, derivações simbólicas e lógica de engenharia (retornando EngineResultDto).
  ↓
[ 5 ] Knowledge Base (JSON / Base de Conhecimento)
       ↳ Fórmulas, propriedades de materiais, constantes físicas e normas.
  ↓
[ 6 ] Repository (Abstração de Dados)
       ↳ Esconde de onde o Knowledge vem, servindo os dados de forma fluída ao frontend.
```

---

## 🛠️ Estado Atual do Projeto (Release Candidate / Pré-Deploy)

A fundação arquitetural foi concluída com êxito. O sistema hoje possui um contrato 100% unificado de front a back.

### 1. Frontend (React 19 + TypeScript + Vite)
- **Design System Omnitrix:** Dark mode elegante com tons neon, glassmorphism e micro-animações.
- **EngineResultView:** Componente universal de UI. Todos os formulários delegam a renderização das respostas (passos a passo, resultados matemáticos em LaTeX, gráficos e avisos) para este motor de visualização.
- **Integração Progressiva (Fallback):** Respostas de API antigas são automaticamente convertidas no frontend para o novo formato de contrato (`EngineResult`), garantindo estabilidade e visual padronizado em todo o site.
- **Code-Splitting e Otimização:** O build de produção compila módulos de cálculo de forma separada, garantindo carregamento instantâneo. Build validado sem warnings ou erros de tipagem.

### 2. Backend (Spring Boot + Java)
- **Contrato Unificado (`EngineResultDto`):** Todos os módulos de cálculo foram redesenhados ou contam com wrappers para conversar usando um contrato único: fornecendo variáveis simbólicas, etapas descritivas (`EngineStepDto`), gráficos paramétricos (`EngineGraphDto`) e avisos padronizados.
- **Tratamento de Exceções:** `GlobalExceptionHandler` intercepta exceções e mapeia para contratos amigáveis ao invés de estourar traces técnicos no cliente.

### 3. Módulos Implementados (Motores Ativos)
**Matemática:**
1. Básica (`/matematica/basico`)
2. Científica (`/matematica/cientifico`)
3. Álgebra e Equações (`/matematica/algebra`)
4. Cálculo Diferencial e Integral (`/matematica/calculo`)
5. Matrizes e Vetores (`/matematica/matrizes`)
6. Números Complexos (`/matematica/complexos`)
7. Estatística e Probabilidade (`/matematica/estatistica`)

**Engenharia:**
8. Estruturas: Vigas Bi-apoiadas (`/engenharia/vigas`)

### 4. Biblioteca de Conhecimento (`/biblioteca`)
- Abstração via `KnowledgeRepository`.
- Base de fórmulas e constantes consultáveis contendo: equação em LaTeX, variáveis, unidades, limitações, hipóteses e referências.

---

## 🔍 Descrição Detalhada: Função por Função (Código)

Para entender a base de código, acompanhe o fluxo abaixo:

### A. Camada Frontend (`frontend/src/`)
1. **`App.tsx` & `main.tsx`:** O coração da aplicação. Define o Roteador, injeta contextos e faz o *lazy load* dinâmico das páginas e calculadoras. É aqui que o Tema Omnitrix é injetado.
2. **`components/layout/`:** Navegação mobile e desktop baseada em roteamento moderno.
3. **`components/engine/EngineResultView.tsx`:** Componente responsável por ler o JSON rico (EngineResult) e renderizar matematicamente os resultados e seus passos usando componentes avançados.
4. **`features/home/` e `features/biblioteca/`:** Páginas que integram a experiência de ensino ao lado das calculadoras puras.
5. **`repository/index.ts`:** A camada anticorrupção do banco de dados (ex: busca fórmulas a partir de IDs).
6. **`core/types/engine.ts`:** O Arquivo Mais Importante. Define a interface `EngineResult`, que dita como o backend responde a todo cálculo e como o frontend renderiza.

### B. Camada Backend (`backend/src/main/java/br/calculaeng/backend/`)
1. **`controller/`:** Pontos de entrada HTTP. Focam em validar os DTOs de entrada e despachar a execução.
2. **`dto/`:** Modelam de forma estrita o que entra (ex: `BeamRequest`) e o que sai (ex: subclasses de `EngineResultDto`).
3. **`service/`:** A camada de domínio onde a matemática real acontece. (Cálculos de integrais simbólicas, trigonometria, equações estáticas, etc).
4. **`GlobalExceptionHandler.java`:** Ponto de segurança que evita vazamento de stacktraces para a UI.

---

## 🚀 Próximos Passos (Evolução Contínua)

O projeto está pronto para a esteira de produção. As próximas *features* programadas focam em confiabilidade e usabilidade avançada:

### 1. Progressive Web App (PWA)
- Transformar a interface web em aplicativo instalável via Chrome/Safari com funcionamento offline (ideal para estudantes na sala de aula).

### 2. Testes Unitários Abrangentes
- Cobertura de testes automatizados na camada de serviços (Service) do backend garantindo estabilidade no processamento de matrizes, cálculo de integrais e vigas perante novos casos de uso.

---

## 💻 Comandos para Desenvolvimento

```bash
# Iniciar o Backend (Terminal 1)
cd backend
mvn spring-boot:run
# Roda em http://localhost:8080

# Iniciar o Frontend (Terminal 2)
cd frontend
npm run dev
# Roda em http://localhost:5173
```
