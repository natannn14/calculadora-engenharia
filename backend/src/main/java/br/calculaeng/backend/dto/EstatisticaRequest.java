package br.calculaeng.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class EstatisticaRequest {
    @NotBlank(message = "A operação estatística não pode ser vazia")
    private String operacao;

    // Usado para estatística descritiva (média, mediana, moda, desvio, variância)
    private List<Double> dados;

    // Usado para distribuição normal
    private Double media;
    private Double desvio;
    private Double x;

    // Usado para distribuição binomial, combinação e permutação
    private Integer n;
    private Integer k;
    private Double p;

    // Usado para regressão linear
    private List<Double> xDados;
    private List<Double> yDados;
}
