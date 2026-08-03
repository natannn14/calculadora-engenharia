package dev.nataborges.calculadora.service;

import dev.nataborges.calculadora.model.Operacao;

public class CalculadoraService {
    
    public double calcular(double a, double b, Operacao operacao) {
        if (operacao == Operacao.NENHUMA) {
            return b;
        }
        
        if (operacao == Operacao.DIVISAO && b == 0) {
            throw new ArithmeticException("Divisão por zero");
        }
        
        return operacao.aplicar(a, b);
    }
    
    public double inverterSinal(double valor) {
        return valor == 0 ? 0 : valor * -1;
    }
    
    public double calcularPorcentagem(double base, double porcentagem, Operacao operacaoPendente) {
        double valorPorcentagem = porcentagem / 100.0;
        
        if (operacaoPendente == Operacao.SOMA || operacaoPendente == Operacao.SUBTRACAO) {
            return base * valorPorcentagem;
        }
        return valorPorcentagem;
    }
}
