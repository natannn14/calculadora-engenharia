# Calculadora Profissional - Java Swing 🚀

Este projeto é uma modernização completa de uma calculadora em Java Swing. O foco central desta refatoração foi transformar um código monolítico, estruturado para fins puramente acadêmicos, em um **projeto de portfólio robusto**, que segue rigorosamente as práticas da indústria corporativa.

## Destaques da Arquitetura
- **MVC (Model-View-Controller)**: Separação total de responsabilidades.
- **Imutabilidade**: O estado da calculadora é gerenciado por uma estrutura imutável.
- **UI Moderna e Responsiva**: Componentização gráfica com *Hover* animado, suporte nativo a Tema Claro e Escuro, e Bordas Arredondadas.
- **UX Avançada**: Operações de memória (MC, MR, M+, M-), atalhos de teclado (Copiar/Colar) e tratamento inteligente de erros.
- **Sem Dependências**: Tudo construído apenas com a API nativa do Java (Core Java/Swing).

## Como Executar
1. Certifique-se de ter o **Java 8+** instalado.
2. Compile as classes: `javac *.java`
3. Execute o Controller/Main: `java Main`

## Como Testar
Para validar o *Core* (Regra de Negócio) sem subir nenhuma tela gráfica, execute a suíte nativa:
`java CalculadoraServiceTest`

*(Nenhuma biblioteca como JUnit foi utilizada para manter a pureza do projeto, servindo como demonstração clara de controle de exceções e asserts)*

## Próximos Passos (Para Estudos)
Acesse os desafios progressivos detalhados em `walkthrough.md`.
