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

O projeto foi refatorado para uma arquitetura em camadas de nível comercial, permitindo crescimento infinito sem degradação do código:

```text
[ 1 ] UI (React + Tailwind + Tema Omnitrix)
       ↳ Gerencia apenas componentes visuais idiotas (botões, inputs, cards).
  ↓
[ 2 ] Features (Formulários e Páginas)
       ↳ Onde a UI encontra a lógica de negócio do frontend (React Router).
  ↓
[ 3 ] Visualization (Camada Gráfica - Planejada)
       ↳ Renderização de gráficos, diagramas de vigas, vetores (SVG/Canvas).
  ↓
[ 4 ] Engine (Backend Spring Boot)
       ↳ Executa os cálculos pesados, derivações simbólicas e lógica de engenharia.
  ↓
[ 5 ] Knowledge Base (JSON / Markdown / Base de Conhecimento)
       ↳ Fórmulas, propriedades de materiais (ex: aço, concreto), constantes físicas e norms.
  ↓
[ 6 ] Repository (Abstração de Dados)
       ↳ Esconde de onde o Knowledge vem (atualmente arquivos locais, futuramente PostgreSQL).
```

---

## 🛠️ Estado Atual do Projeto (O que já temos)

O projeto encontra-se com a **Fundação Arquitetural (v0.1 e v0.2) 100% concluída**.

### 1. Frontend (React 19 + TypeScript + Vite)
- **Design System:** Substituímos o antigo "Legacy Swing" pelo **Tema Omnitrix** (Dark mode elegante com tons neon, glassmorphism, e animações suaves).
- **Roteamento:** Implementado `react-router-dom` moderno. Nada de gerenciamento de estado manual para abas; tudo é baseado em URLs semânticas (`/matematica/calculo`, `/engenharia/vigas`).
- **Code-Splitting:** Uso intensivo de `React.lazy()`. Cada módulo de cálculo é um "chunk" JS separado, garantindo que o app carregue instantaneamente.
- **Responsividade (Mobile First):** Layout adaptável com Sidebar no desktop e `MobileNav` + menu expansível no celular.

### 2. Módulos Implementados (8 Motores Ativos)
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

### 3. Biblioteca de Conhecimento (`/biblioteca`)
- Abstração via `KnowledgeRepository`.
- 20 fórmulas reais cadastradas em JSON, contendo: equação em LaTeX, variáveis, unidades, limitações, hipóteses, erros comuns e bibliografia.

---

## 🔍 Descrição Detalhada: Função por Função (Código)

Para entender a base de código, acompanhe o fluxo abaixo:

### A. Camada Frontend (`frontend/src/`)
1. **`App.tsx` & `main.tsx`:** O coração da aplicação. Define o Roteador, injeta contextos (`UserModeContext`) e faz o *lazy load* dinâmico das páginas e calculadoras. É aqui que o Tema Omnitrix é injetado globalmente.
2. **`components/layout/`:**
   - `Layout.tsx`: O esqueleto da página (Header, Main Content flexível).
   - `Sidebar.tsx` / `MobileNav.tsx`: Navegação baseada em `<NavLink>` (que detecta automaticamente qual rota está ativa).
3. **`features/home/HomePage.tsx`:** A "Landing Page" interna. Mostra os cards dos módulos (Física, Matemática, Engenharia), um grid de acesso rápido e os Princípios do Produto.
4. **`features/biblioteca/BibliotecaPage.tsx`:** Consome o `KnowledgeRepository` para listar fórmulas matemáticas/físicas, com barra de busca e filtros. Ao clicar num card, ele se expande revelando os detalhes técnicos da fórmula.
5. **`repository/index.ts`:** A camada anticorrupção do banco de dados. O frontend chama `knowledgeRepo.searchFormulas()`, sem saber que por trás há um arquivo JSON sendo lido.
6. **`core/types/engine.ts`:** **O Arquivo Mais Importante.** Define a interface `EngineResult`, que é o contrato que dita como o backend *deveria* responder a todo cálculo.

### B. Camada Backend (`backend/src/main/java/br/calculaeng/backend/`)
1. **`controller/`:** Os pontos de entrada da API. Recebem requisições HTTP (`POST /api/cientifico/calcular`). Todos validam a entrada usando a anotação `@Valid`.
   - Exemplo: `CalculadoraCientificaController.java` mapeia operações ("seno", "log10") e chama o serviço.
   - Exemplo: `BeamController.java` recebe cargas e vãos de vigas.
2. **`dto/`:** (Data Transfer Objects). Os moldes dos dados. `BeamRequest` dita que a requisição de viga precisa ter "span" (vão) e "load" (carga).
3. **`service/`:** Aonde a matemática acontece. A lógica real. O `CalculadoraCientificaService` faz os cálculos trigonométricos. O `BeamService` calcula reações de apoio, esforço cortante e momento fletor, gerando arrays de dados.
4. **`GlobalExceptionHandler.java`:** Intercepta qualquer erro (ex: divisão por zero ou falta de preenchimento) e devolve um JSON amigável e padronizado de Erro para o frontend.

---

## ⚠️ O Grande Gargalo (O que falta para ser usual)

Embora a arquitetura base esteja fantástica, **o produto ainda não é 100% usual devido a uma desconexão entre Front e Back.**

- **O Problema:** No `core/types/engine.ts`, o frontend espera receber um retorno ultra-rico (`EngineResult`) com o resultado numérico, passos do cálculo (`calculationSteps`), gráficos (`graphs`), avisos (`warnings`) e referências às fórmulas (`usedFormulaId`).
- **A Realidade:** Hoje, os Controllers no backend ainda estão retornando mapas simples (ex: `{"resultado": 42.0}`). Apenas o módulo de Vigas tenta retornar algo mais complexo (`BeamResponse`), mas ainda assim, não padronizado.

Isso significa que, atualmente, as calculadoras funcionam, mas não conseguem "ensinar" nem exibir gráficos de forma padronizada.

---

## 🚀 Próximos Passos (Roadmap de Execução)

Para transformar o projeto num MVP comercial:

### 1. Refatoração do Contrato (Backend)
- Criar a classe `EngineResultDto` no Spring Boot exatamente como a interface TypeScript.
- Alterar **todos** os controllers e serviços para que devolvam esse objeto unificado. Se a calculadora for básica, devolve o `EngineResult` sem passos. Se for o Symja (simbólico), devolve com os passos de integração.

### 2. Componente de Visualização (Frontend)
- Criar um componente `<EngineResultView result={data} />` no frontend.
- Esse componente será a interface padrão. Ele vai ler o JSON de resposta e renderizar automaticamente o resultado numérico, abrir um acordeão de passo a passo (em LaTeX), e se tiver um `usedFormulaId`, vai no Repository buscar a explicação da fórmula e exibir abaixo.

### 3. Progressive Web App (PWA)
- Adicionar o `vite-plugin-pwa` e o `manifest.json`.
- Permitir que o aluno acesse o site no Chrome do celular, clique em "Instalar Aplicativo" e o use offline durante as aulas.

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
