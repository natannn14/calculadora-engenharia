# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo. O formato é baseado em [Keep a Changelog](https://keepachangelog.com/).

## [2.0.0] - Modernização Profissional e UX

### Adicionado
- **Padrão Arquitetural MVC**: `CalculadoraController` introduzido para orquestrar dados e tela.
- **Sistema de Temas**: Suporte a alternância entre `TemaEscuro` e `TemaClaro` dinamicamente pelo JMenuBar.
- **Botões de Memória**: Funcionalidades MC, MR, M+ e M- implementadas via controle de estado imutável.
- **Atalhos e Transferência**: Suporte a Ctrl+C para copiar resultados e Ctrl+V para injetar números.
- **Suporte a Teclado Nativo**: Toda a aplicação escuta aos eventos de Enter, Backspace, Esc e números através de um `KeyboardFocusManager` central.
- **Testes Unitários**: `CalculadoraServiceTest` nativo para proteção da lógica de divisão por zero, soma, etc.

### Modificado
- `Calculadora.java` (Antigo) preservado como `CalculadoraLegacy.java` (Sem modificações) para fins educacionais e comparativos.
- `CalculadoraEstado` alterado de `record` para `class` imutável para suportar o ambiente de desenvolvimento JRE 1.8 sem conflitos.
- Design da UI refeito utilizando `GridLayout` customizado, removendo a necessidade de bordas feias ou espaçamentos absolutos.

### Removido
- Acoplamento entre Lógica Matemática e Janela Gráfica. A Matemática (`CalculadoraService`) agora opera totalmente cega sobre onde está sendo exibida.
