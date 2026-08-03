package dev.nataborges.calculadora.model;

import dev.nataborges.calculadora.config.Constantes;
import dev.nataborges.calculadora.formatter.FormatadorNumero;

import java.text.ParseException;

public record CalculadoraEstado(
    double operandoAnterior,
    double operandoAtual,
    String inputAtual,
    Operacao operacaoPendente,
    boolean aguardandoNovoNumero,
    String historico,
    String mensagemErro,
    double memoria
) {
    public static CalculadoraEstado estadoInicial() {
        return new CalculadoraEstado(0, 0, "0", Operacao.NENHUMA, true, "", null, 0);
    }
    
    public CalculadoraEstado comOperandoAtual(double novoValor, String novoInput) {
        return new CalculadoraEstado(operandoAnterior, novoValor, novoInput, operacaoPendente, false, historico, null, memoria);
    }

    public CalculadoraEstado comResultadoIntermediario(double resultado, String novoInput) {
        return new CalculadoraEstado(operandoAnterior, resultado, novoInput, operacaoPendente, true, historico, null, memoria);
    }
    
    public CalculadoraEstado comOperacao(Operacao novaOperacao, double resultado, String novoHistorico) {
        return new CalculadoraEstado(resultado, resultado, "0", novaOperacao, true, novoHistorico, null, memoria);
    }

    public CalculadoraEstado fecharCalculo(double resultado, String novoHistorico, String novoInput) {
        return new CalculadoraEstado(resultado, resultado, novoInput, Operacao.NENHUMA, true, novoHistorico, null, memoria);
    }
    
    public CalculadoraEstado comErro(String erro) {
        return new CalculadoraEstado(operandoAnterior, operandoAtual, inputAtual, operacaoPendente, aguardandoNovoNumero, historico, erro, memoria);
    }
    
    public CalculadoraEstado comMemoria(double novaMemoria) {
        return new CalculadoraEstado(operandoAnterior, operandoAtual, inputAtual, operacaoPendente, aguardandoNovoNumero, historico, mensagemErro, novaMemoria);
    }
    
    public CalculadoraEstado reset() {
        return new CalculadoraEstado(0, 0, "0", Operacao.NENHUMA, true, "", null, memoria);
    }

    public CalculadoraEstado adicionarDigito(String digito, FormatadorNumero formatador) {
        String novoInput = aguardandoNovoNumero ? "" : inputAtual;
        
        if (digito.equals(",")) {
            if (novoInput.isEmpty()) novoInput = "0,";
            else if (novoInput.contains(",")) return this;
            else novoInput += ",";
        } else {
            if (novoInput.equals("0")) novoInput = digito;
            else novoInput += digito;
        }

        if (novoInput.length() > Constantes.MAX_DIGITOS) return this;

        try {
            double novoValor = formatador.parse(novoInput);
            return comOperandoAtual(novoValor, novoInput);
        } catch (ParseException e) {
            return this;
        }
    }

    public CalculadoraEstado apagarUltimoDigito(FormatadorNumero formatador) {
        if (aguardandoNovoNumero) return this;

        String novoInput = inputAtual;
        if (!novoInput.isEmpty()) {
            novoInput = novoInput.substring(0, novoInput.length() - 1);
            if (novoInput.isEmpty() || novoInput.equals("-")) {
                novoInput = "0";
                return comOperandoAtual(0, novoInput).comResultadoIntermediario(0, novoInput);
            } else {
                try {
                    double novoValor = formatador.parse(novoInput);
                    return comOperandoAtual(novoValor, novoInput);
                } catch (ParseException e) {
                    return this;
                }
            }
        }
        return this;
    }
}
