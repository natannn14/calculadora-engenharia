# Arquitetura da Calculadora

A arquitetura do projeto foi desenhada visando altíssima coesão e separação restrita de responsabilidades (SOLID). O diagrama mental da aplicação segue o fluxo abaixo:

## Diagrama de Responsabilidade

```text
[ GUI Swing ] <========> [ Controller ] =========> [ Service / Core ]
      |                        |                           |
- Apenas desenha         - Recebe strings            - Recebe (double, double)
- Escuta cliques         - Manipula o Estado         - Conhece apenas a Operacao
- Usa Interface Tema     - Valida Entradas           - Devolve double puro
                         - Repinta a Tela
```

## 1. Core (Regra de Negócio)
*   **`CalculadoraService`**: A única classe autorizada a realizar contas. É *stateless* (não guarda valores). Seu papel é ser uma calculadora "de papel". Se você der 2 números e uma operação, ela dá o resultado. Caso a GUI decida virar Web, Android ou Terminal, esse serviço **não sofrerá nem 1 caractere de alteração**.
*   **`Operacao` (Enum)**: Aplica o padrão *Strategy*. Cada operação (+, -, *) sabe como se resolver sozinha em seu próprio método `aplicar(a, b)`. Isso aniquila os `switch/case` e permite criar uma operação de Raiz Quadrada amanhã apenas adicionando uma linha no Enum, sem encostar no Serviço.
*   **`CalculadoraEstado`**: Atua como o *State* (ou o "Redux" da nossa aplicação). É **imutável**. O controller nunca faz `estado.valor = 5;`. Ele faz `estado = estado.comNovoValor(5)`. Isso elimina qualquer bug de condição de corrida e blinda o projeto contra inconsistências invisíveis.

## 2. Controller (Orquestrador)
*   **`CalculadoraController`**: A ponte. Ele escuta cliques em botões (Strings como "+", "M+", "Esc") e as traduz em ações matemáticas, guardando o resultado dentro de um *novo* `CalculadoraEstado` e forçando a View a se redesenhar (`atualizarView`).

## 3. View (Camada Swing)
*   **`CalculadoraFrame`**: Janela pai.
*   **`VisorCalculadora`**: Encapsula apenas a Label visual.
*   **`PainelBotoes`**: Distribui os botões.
*   **`BotaoCalculadora`**: Estilização rica (Hover, Arredondamento, Redimensionamento). Não tem a menor ideia do que faz quando clicado.

## O que ganhamos com isso?
1. **DRY e KISS**: Nenhuma lógica repetida.
2. **Escalabilidade Extrema**: O *Core* sobrevive à morte do Swing.
3. **Testabilidade Nível A**: É impossível testar uma Janela clicando com o mouse automaticamente no Java básico. Porém, graças à quebra de componentes, podemos criar um script (`CalculadoraServiceTest`) que roda 5.000 continhas de multiplicação direto no `Service` em 5 milissegundos sem sequer abrir a janela.
