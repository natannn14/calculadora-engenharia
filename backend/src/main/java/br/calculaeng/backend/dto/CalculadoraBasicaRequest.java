package br.calculaeng.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CalculadoraBasicaRequest {

    @NotBlank(message = "A operação não pode estar vazia")
    private String operacao;

    private Double a = 0.0;
    private Double b = 0.0;

    public String getOperacao() {
        return operacao;
    }

    public void setOperacao(String operacao) {
        this.operacao = operacao;
    }

    public Double getA() {
        return a;
    }

    public void setA(Double a) {
        this.a = a;
    }

    public Double getB() {
        return b;
    }

    public void setB(Double b) {
        this.b = b;
    }
}
