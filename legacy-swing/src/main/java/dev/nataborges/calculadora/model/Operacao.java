package dev.nataborges.calculadora.model;

public enum Operacao {
    SOMA("+", "Somar") {
        @Override
        public double aplicar(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO("-", "Subtrair") {
        @Override
        public double aplicar(double a, double b) {
            return a - b;
        }
    },
    MULTIPLICACAO("×", "Multiplicar") {
        @Override
        public double aplicar(double a, double b) {
            return a * b;
        }
    },
    DIVISAO("÷", "Dividir") {
        @Override
        public double aplicar(double a, double b) {
            if (b == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            return a / b;
        }
    },
    NENHUMA("", "") {
        @Override
        public double aplicar(double a, double b) {
            return b;
        }
    };

    private final String simbolo;
    private final String descricao;

    Operacao(String simbolo, String descricao) {
        this.simbolo = simbolo;
        this.descricao = descricao;
    }

    public String getSimbolo() {
        return simbolo;
    }

    public String getDescricao() {
        return descricao;
    }

    public abstract double aplicar(double a, double b);
    
    public static Operacao fromSimbolo(String simbolo) {
        for (Operacao op : values()) {
            if (op.getSimbolo().equals(simbolo) || 
                (op == MULTIPLICACAO && simbolo.equals("*")) ||
                (op == DIVISAO && simbolo.equals("/"))) {
                return op;
            }
        }
        return NENHUMA;
    }
}
