# CalculaEng

> Motor de cálculo simbólico e análise estrutural para engenharia.

## O Problema

Estudantes e profissionais de engenharia frequentemente enfrentam dois gargalos diários:

1. **Calculadoras simbólicas engessadas ou pagas:** Ferramentas tradicionais de CAS (Computer Algebra System) são pesadas, possuem sintaxes obscuras ou exigem assinaturas caras para exibir o passo a passo da resolução.
2. **Falta de contexto nativo em pt-BR:** A maioria dos CAS exige comandos em inglês e notação estritamente internacional (ex: `tan` em vez de `tg`, `sin` em vez de `sen`), gerando erros bobos de digitação durante a resolução de exercícios.
3. **Ferramentas genéricas sem foco em aplicação direta:** Calculadoras comuns resolvem a conta, mas não geram os diagramas estruturais (Momento Fletor e Esforço Cortante) com os passos detalhados para validação rápida de projetos e trabalhos acadêmicos.

## A Solução

O **CalculaEng** resolve isso combinando um motor simbólico de alta precisão no backend com uma interface web moderna, rápida e otimizada para notação brasileira:

- **Notação Pt-BR Nativa:** Tradução automática de termos como `tg`, `sen`, `arctg` e adição automática da constante de integração (`+ C`) em integrais indefinidas.
- **Resolução Simbólica Passo a Passo:** Derivadas, integrais, limites, séries de Taylor, simplificação, expansão e fatoração com explicitação da memória de cálculo.
- **Templates de Engenharia:** Módulo dedicado para análise de vigas bi-apoiadas com geração automática de diagramas $M(x)$ e $V(x)$ via SVG responsivo.
- **Interface Baseada no Legacy Swing:** Visual escuro minimalista focado em produtividade e alto contraste, sem distrações.

---

## Stack Tecnológica

| Camada | Tecnologia | Descrição |
|--------|------------|-----------|
| **Backend** | Java 21 + Spring Boot 3.2 | API REST para orquestração |
| **CAS Engine** | Symja 3.2 | Motor matemático de álgebra computacional |
| **Frontend** | React 19 + TypeScript + Vite | SPA reativa e otimizada |
| **Styling** | Vanilla CSS + Tailwind v4 | Design system customizado (Tema Legacy-Swing) |

---

## Arquitetura do Projeto

```text
.
├── backend/          # API REST em Spring Boot (Java 21)
│   └── src/main/java/br/calculaeng/backend/
│       ├── controller/   # Endpoints (/api/symbolic, /api/templates/beam)
│       ├── dto/          # Objetos de transferência de dados
│       └── service/      # Integração com Symja CAS e física aplicada
├── frontend/         # SPA em React + TypeScript + Vite
│   └── src/
│       ├── components/   # Formulários, teclados rápidos e gráficos SVG
│       ├── App.tsx
│       └── index.css     # Design tokens do tema Legacy-Swing
└── legacy-swing/     # Aplicação desktop original em Java Swing (referência)
```

---

## Como Executar Localmente

### Pré-requisitos
- **Java JDK 21** ou superior
- **Node.js 20** ou superior
- **Git**

### 1. Iniciar o Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```
> O servidor iniciará em `http://localhost:8080`.

### 2. Iniciar o Frontend (React + Vite)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```
> Acesse a aplicação em `http://localhost:5173`.

---

## Endpoints da API

### `POST /api/symbolic`
Executa operações de cálculo simbólico.

```json
{
  "task": "derive",
  "expr": "x^3 * sen(x)",
  "variable": "x",
  "lang": "pt-BR"
}
```

*Tasks suportadas:* `derive`, `integrate`, `simplify`, `solve`, `expand`, `factor`, `limit`, `taylor`.

---

### `POST /api/templates/beam`
Calcula esforços solicitantes e reações em vigas bi-apoiadas.

```json
{
  "span": { "value": 6, "unit": "m" },
  "load": { "value": 10, "unit": "kN/m" }
}
```

---

## Roadmap

- [ ] PWA (suporte a instalação mobile e offline)
- [ ] Exportação de relatórios em PDF/LaTeX
- [ ] Novos templates estruturais (viga engastada, pórticos planos)

---

## Licença

Este projeto está sob a licença MIT.
