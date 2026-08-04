package br.calculaeng.backend.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CalculadoraBasicaService {

    public double somar(double a, double b) { return a + b; }
    public double subtrair(double a, double b) { return a - b; }
    public double multiplicar(double a, double b) { return a * b; }
    public double dividir(double a, double b) {
        if (b == 0) throw new ArithmeticException("Divisão por zero");
        return a / b;
    }
    public double porcentagem(double valor, double percentual) {
        return (valor * percentual) / 100.0;
    }
    public double raizQuadrada(double a) {
        if (a < 0) throw new ArithmeticException("Raiz quadrada de número negativo");
        return Math.sqrt(a);
    }
    public double raizNesima(double a, double n) {
        if (n == 0) throw new ArithmeticException("Índice da raiz não pode ser zero");
        if (a < 0 && n % 2 == 0) throw new ArithmeticException("Raiz de índice par de número negativo");
        return Math.pow(a, 1.0 / n);
    }
    public double potencia(double base, double expoente) {
        return Math.pow(base, expoente);
    }
    public double modulo(double a, double b) {
        if (b == 0) throw new ArithmeticException("Divisão por zero no módulo");
        return a % b;
    }
    public long fatorial(int n) {
        if (n < 0) throw new ArithmeticException("Fatorial de número negativo");
        long fat = 1;
        for (int i = 2; i <= n; i++) fat *= i;
        return fat;
    }
    public double inverso(double a) {
        if (a == 0) throw new ArithmeticException("Divisão por zero");
        return 1.0 / a;
    }
    public double absoluto(double a) {
        return Math.abs(a);
    }
}
