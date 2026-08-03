# CalculaEng

Motor de cálculo simbólico e estrutural para engenharia. Backend em Java (Spring Boot + Symja CAS), frontend em React/Vite com TypeScript.

## O que faz

- **Cálculo simbólico:** derivadas, integrais, simplificação, fatoração, expansão polinomial, limites e séries de Taylor
- **Análise estrutural:** viga bi-apoiada com carga distribuída — reações de apoio, diagramas de momento fletor e esforço cortante
- **Normalização pt-BR:** aceita `tg`, `sen`, `arctg` e converte automaticamente para a notação do CAS

## Stack

| Camada | Tech | Versão |
|--------|------|--------|
| Backend | Java 21, Spring Boot, Symja CAS | 3.2.4 / 3.2.0 |
| Frontend | React, TypeScript, Vite, Tailwind CSS | 19.x / 8.x / 4.x |
| Legacy | Java Swing (referência de tema) | — |

## Estrutura

```
.
├── backend/          # API REST (Spring Boot + Symja)
│   └── src/main/java/br/calculaeng/backend/
│       ├── controller/   # CalculadoraController, BeamController
│       ├── dto/          # Request/Response objects
│       └── service/      # SymbolicService, BeamService
├── frontend/         # SPA (React + Vite)
│   └── src/
│       ├── components/   # SymbolicForm, BeamForm, SymbolicKeyboard
│       ├── App.tsx
│       └── index.css     # Design system (legacy-swing web)
└── legacy-swing/     # Calculadora desktop original (Java Swing)
```

## Rodando

### Pré-requisitos

- Java 21+
- Node.js 20+
- npm

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Sobe em `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173`.

## API

### POST `/api/symbolic`

```json
{
  "task": "derive",
  "expr": "x^3 * sin(x)",
  "variable": "x",
  "lang": "pt-BR"
}
```

Tasks: `derive`, `integrate`, `simplify`, `solve`, `expand`, `factor`, `limit`, `taylor`.

### POST `/api/templates/beam`

```json
{
  "span": { "value": 6, "unit": "m" },
  "load": { "value": 10, "unit": "kN/m" }
}
```

Retorna reações, momento máximo, cortante máximo, diagramas ponto-a-ponto e passos resolvidos.

## Tema

O frontend reproduz as cores do `TemaEscuro.java` do Swing adaptadas pra web:

| Elemento | Cor |
|----------|-----|
| Fundo principal | `#202020` |
| Operador | `#D26E00` |
| Igual | `#1E821E` |
| Clear | `#B43232` |

Toggle claro/escuro no header.

## Roadmap

- [ ] PWA (manifest + service worker)
- [ ] Mais templates estruturais (viga engastada, pórtico)
- [ ] Gráficos interativos nos diagramas
- [ ] Deploy (backend em container, frontend em CDN)

## Licença

MIT
