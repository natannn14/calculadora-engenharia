package br.calculaeng.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CalculadoraCientificaRequest {

    @NotBlank(message = "A operação não pode estar vazia")
    private String operacao;

    private Double a = 0.0;
    private Double base = 10.0;
    private Boolean isGraus = true;

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

    public Double getBase() {
        return base;
    }

    public void setBase(Double base) {
        this.base = base;
    }

    public Boolean getIsGraus() {
        return isGraus;
    }

    public void setIsGraus(Boolean isGraus) {
        this.isGraus = isGraus;
    }
}
