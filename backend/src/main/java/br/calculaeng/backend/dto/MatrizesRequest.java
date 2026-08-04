package br.calculaeng.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class MatrizesRequest {

    @NotBlank(message = "A operação não pode estar vazia")
    private String operacao;

    private List<List<Double>> matrizA;
    private List<List<Double>> matrizB;
    private List<Double> vetorU;
    private List<Double> vetorV;

    public String getOperacao() {
        return operacao;
    }

    public void setOperacao(String operacao) {
        this.operacao = operacao;
    }

    public List<List<Double>> getMatrizA() {
        return matrizA;
    }

    public void setMatrizA(List<List<Double>> matrizA) {
        this.matrizA = matrizA;
    }

    public List<List<Double>> getMatrizB() {
        return matrizB;
    }

    public void setMatrizB(List<List<Double>> matrizB) {
        this.matrizB = matrizB;
    }

    public List<Double> getVetorU() {
        return vetorU;
    }

    public void setVetorU(List<Double> vetorU) {
        this.vetorU = vetorU;
    }

    public List<Double> getVetorV() {
        return vetorV;
    }

    public void setVetorV(List<Double> vetorV) {
        this.vetorV = vetorV;
    }
}
