package dev.nataborges.calculadora.controller;

import dev.nataborges.calculadora.formatter.FormatadorNumero;
import dev.nataborges.calculadora.infrastructure.ClipboardService;
import dev.nataborges.calculadora.model.CalculadoraEstado;
import dev.nataborges.calculadora.model.Operacao;
import dev.nataborges.calculadora.service.CalculadoraService;
import dev.nataborges.calculadora.view.VisorCalculadora;

import java.text.ParseException;

public class CalculadoraController {
    private CalculadoraEstado estadoAtual;
    private final CalculadoraService servico;
    private final FormatadorNumero formatador;
    private final ClipboardService clipboardService;
    private final VisorCalculadora visor;

    public CalculadoraController(VisorCalculadora visor) {
        this(visor, CalculadoraEstado.estadoInicial());
    }

    public CalculadoraController(VisorCalculadora visor, CalculadoraEstado estadoInicial) {
        this.visor = visor;
        this.servico = new CalculadoraService();
        this.formatador = new FormatadorNumero();
        this.clipboardService = new ClipboardService();
        this.estadoAtual = estadoInicial;
        atualizarView();
    }

    public CalculadoraEstado getEstadoAtual() {
        return estadoAtual;
    }

    public void processarComando(String comando) {
        if (estadoAtual.mensagemErro() != null) {
            estadoAtual = estadoAtual.reset();
        }

        if (isNumero(comando)) {
            estadoAtual = estadoAtual.adicionarDigito(comando, formatador);
            atualizarView();
            return;
        }

        estadoAtual = switch (comando) {
            case "C", "Esc", "Delete" -> estadoAtual.reset();
            case "=", "Enter" -> processarIgual();
            case "Backspace" -> estadoAtual.apagarUltimoDigito(formatador);
            case "±" -> processarInverterSinal();
            case "%" -> processarPorcentagem();
            case "MC" -> estadoAtual.comMemoria(0);
            case "MR" -> estadoAtual.comResultadoIntermediario(estadoAtual.memoria(), formatador.formatar(estadoAtual.memoria()));
            case "M+" -> estadoAtual.comMemoria(estadoAtual.memoria() + estadoAtual.operandoAtual());
            case "M-" -> estadoAtual.comMemoria(estadoAtual.memoria() - estadoAtual.operandoAtual());
            case "Copy" -> processarCopy();
            case "Paste" -> processarPaste();
            default -> processarOperadorFallback(comando);
        };

        atualizarView();
    }

    private CalculadoraEstado processarOperadorFallback(String comando) {
        Operacao op = Operacao.fromSimbolo(comando);
        if (op != Operacao.NENHUMA) {
            return processarOperador(op);
        }
        return estadoAtual;
    }

    private CalculadoraEstado processarOperador(Operacao novaOperacao) {
        CalculadoraEstado novoEstado = estadoAtual;
        if (!estadoAtual.aguardandoNovoNumero() && estadoAtual.operacaoPendente() != Operacao.NENHUMA) {
            novoEstado = realizarCalculoPendente();
        }

        if (novoEstado.mensagemErro() == null) {
            String novoHistorico = formatador.formatar(novoEstado.operandoAtual()) + " " + novaOperacao.getSimbolo();
            novoEstado = novoEstado.comOperacao(novaOperacao, novoEstado.operandoAtual(), novoHistorico);
        }
        return novoEstado;
    }

    private CalculadoraEstado processarIgual() {
        if (estadoAtual.operacaoPendente() == Operacao.NENHUMA) {
            return estadoAtual;
        }

        double num1 = estadoAtual.operandoAnterior();
        double num2 = estadoAtual.operandoAtual();
        Operacao op = estadoAtual.operacaoPendente();
        String historico = formatador.formatar(num1) + " " + op.getSimbolo() + " " + formatador.formatar(num2) + " =";

        CalculadoraEstado aposCalculo = realizarCalculoPendente();
        
        if (aposCalculo.mensagemErro() == null) {
            return aposCalculo.fecharCalculo(aposCalculo.operandoAtual(), historico, formatador.formatar(aposCalculo.operandoAtual()));
        }
        return aposCalculo;
    }

    private CalculadoraEstado realizarCalculoPendente() {
        try {
            double resultado = servico.calcular(
                    estadoAtual.operandoAnterior(),
                    estadoAtual.operandoAtual(),
                    estadoAtual.operacaoPendente());
            return estadoAtual.comResultadoIntermediario(resultado, formatador.formatar(resultado));
        } catch (ArithmeticException e) {
            return estadoAtual.comErro("Divisão por zero");
        }
    }

    private CalculadoraEstado processarInverterSinal() {
        if (estadoAtual.aguardandoNovoNumero() && estadoAtual.operandoAtual() == 0) return estadoAtual;
        double novoValor = servico.inverterSinal(estadoAtual.operandoAtual());
        return estadoAtual.comOperandoAtual(novoValor, formatador.formatar(novoValor));
    }

    private CalculadoraEstado processarPorcentagem() {
        double valorPorcentagem = servico.calcularPorcentagem(
                estadoAtual.operandoAnterior(), 
                estadoAtual.operandoAtual(), 
                estadoAtual.operacaoPendente());
                
        return estadoAtual.comResultadoIntermediario(valorPorcentagem, formatador.formatar(valorPorcentagem));
    }

    private CalculadoraEstado processarCopy() {
        clipboardService.copiar(estadoAtual.inputAtual());
        return estadoAtual;
    }

    private CalculadoraEstado processarPaste() {
        clipboardService.colar().ifPresent(texto -> {
            try {
                if (isNumero(texto.substring(0, 1)) || texto.startsWith("-")) {
                    double novoValor = formatador.parse(texto);
                    estadoAtual = estadoAtual.comOperandoAtual(novoValor, texto);
                }
            } catch (ParseException e) {}
        });
        return estadoAtual;
    }

    private void atualizarView() {
        if (estadoAtual.mensagemErro() != null) {
            visor.setTextoVisorAtual(estadoAtual.mensagemErro());
            visor.setHistorico("");
        } else {
            visor.setTextoVisorAtual(estadoAtual.inputAtual());
            visor.setHistorico(estadoAtual.historico());
        }
    }

    private boolean isNumero(String str) {
        return str.matches("[0-9]") || str.equals(",");
    }
}
