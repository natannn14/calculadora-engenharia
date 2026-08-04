package br.calculaeng.backend.services;

import br.calculaeng.backend.dto.EstatisticaRequest;
import org.apache.commons.math3.distribution.BinomialDistribution;
import org.apache.commons.math3.distribution.NormalDistribution;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.apache.commons.math3.util.CombinatoricsUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EstatisticaService {

    public Map<String, Object> calcular(EstatisticaRequest request) {
        Map<String, Object> resultado = new HashMap<>();
        String op = request.getOperacao().toLowerCase();
        
        try {
            switch (op) {
                case "media":
                case "mediana":
                case "moda":
                case "desvio_amostral":
                case "desvio_populacional":
                case "variancia_amostral":
                case "variancia_populacional":
                    validarDados(request.getDados());
                    calcularDescritiva(request, op, resultado);
                    break;
                case "normal_pdf":
                case "normal_cdf":
                    validarNormal(request);
                    calcularNormal(request, op, resultado);
                    break;
                case "binomial_pdf":
                case "binomial_cdf":
                    validarBinomial(request);
                    calcularBinomial(request, op, resultado);
                    break;
                case "combinacao":
                case "permutacao":
                    validarAnaliseCombinatoria(request);
                    calcularCombinatoria(request, op, resultado);
                    break;
                case "regressao_linear":
                    validarRegressao(request);
                    calcularRegressao(request, resultado);
                    break;
                default:
                    throw new IllegalArgumentException("Operação estatística desconhecida: " + op);
            }
        } catch (Exception e) {
            resultado.put("erro", e.getMessage());
        }

        return resultado;
    }

    private void calcularDescritiva(EstatisticaRequest request, String op, Map<String, Object> resultado) {
        DescriptiveStatistics stats = new DescriptiveStatistics();
        for (Double d : request.getDados()) {
            stats.addValue(d);
        }
        
        switch (op) {
            case "media":
                resultado.put("resultado", stats.getMean());
                break;
            case "mediana":
                resultado.put("resultado", stats.getPercentile(50));
                break;
            case "moda":
                resultado.put("resultado", calcularModa(request.getDados()));
                break;
            case "desvio_amostral":
                if (request.getDados().size() < 2) throw new IllegalArgumentException("Desvio padrão amostral requer pelo menos 2 elementos");
                resultado.put("resultado", stats.getStandardDeviation());
                break;
            case "desvio_populacional":
                resultado.put("resultado", stats.getPopulationVariance() > 0 ? Math.sqrt(stats.getPopulationVariance()) : 0.0);
                break;
            case "variancia_amostral":
                if (request.getDados().size() < 2) throw new IllegalArgumentException("Variância amostral requer pelo menos 2 elementos");
                resultado.put("resultado", stats.getVariance());
                break;
            case "variancia_populacional":
                resultado.put("resultado", stats.getPopulationVariance());
                break;
        }
    }
    
    private List<Double> calcularModa(List<Double> dados) {
        Map<Double, Integer> frequencias = new HashMap<>();
        for (Double d : dados) {
            frequencias.put(d, frequencias.getOrDefault(d, 0) + 1);
        }
        int maxFreq = frequencias.values().stream().max(Integer::compare).orElse(0);
        return frequencias.entrySet().stream()
                .filter(e -> e.getValue() == maxFreq)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private void calcularNormal(EstatisticaRequest request, String op, Map<String, Object> resultado) {
        NormalDistribution normal = new NormalDistribution(request.getMedia(), request.getDesvio());
        if (op.equals("normal_pdf")) {
            resultado.put("resultado", normal.density(request.getX()));
        } else {
            resultado.put("resultado", normal.cumulativeProbability(request.getX()));
        }
    }

    private void calcularBinomial(EstatisticaRequest request, String op, Map<String, Object> resultado) {
        BinomialDistribution binomial = new BinomialDistribution(request.getN(), request.getP());
        if (op.equals("binomial_pdf")) {
            resultado.put("resultado", binomial.probability(request.getK()));
        } else {
            resultado.put("resultado", binomial.cumulativeProbability(request.getK()));
        }
    }

    private void calcularCombinatoria(EstatisticaRequest request, String op, Map<String, Object> resultado) {
        int n = request.getN();
        int k = request.getK();
        if (op.equals("combinacao")) {
            resultado.put("resultado", CombinatoricsUtils.binomialCoefficientDouble(n, k));
        } else {
            // Permutação: P(n,k) = n! / (n-k)! = C(n,k) * k!
            double comb = CombinatoricsUtils.binomialCoefficientDouble(n, k);
            double perm = comb * CombinatoricsUtils.factorialDouble(k);
            resultado.put("resultado", perm);
        }
    }

    private void calcularRegressao(EstatisticaRequest request, Map<String, Object> resultado) {
        SimpleRegression regression = new SimpleRegression();
        List<Double> xs = request.getXDados();
        List<Double> ys = request.getYDados();
        
        for (int i = 0; i < xs.size(); i++) {
            regression.addData(xs.get(i), ys.get(i));
        }
        
        Map<String, Double> coeficientes = new HashMap<>();
        coeficientes.put("a", regression.getIntercept()); // coef linear (intercepto)
        coeficientes.put("b", regression.getSlope()); // coef angular (inclinação)
        coeficientes.put("r2", regression.getRSquare()); // R quadrado
        
        resultado.put("resultado", coeficientes);
        resultado.put("equacao", String.format("y = %.4f + %.4fx", regression.getIntercept(), regression.getSlope()));
    }

    // Validações
    private void validarDados(List<Double> dados) {
        if (dados == null || dados.isEmpty()) {
            throw new IllegalArgumentException("A lista de dados não pode estar vazia");
        }
    }
    
    private void validarNormal(EstatisticaRequest request) {
        if (request.getMedia() == null || request.getDesvio() == null || request.getX() == null) {
            throw new IllegalArgumentException("Média, desvio e x são obrigatórios para distribuição normal");
        }
        if (request.getDesvio() <= 0) {
            throw new IllegalArgumentException("O desvio padrão deve ser maior que zero");
        }
    }
    
    private void validarBinomial(EstatisticaRequest request) {
        if (request.getN() == null || request.getK() == null || request.getP() == null) {
            throw new IllegalArgumentException("n, k e p são obrigatórios para distribuição binomial");
        }
        if (request.getN() < 0 || request.getK() < 0 || request.getK() > request.getN()) {
            throw new IllegalArgumentException("Valores inválidos: n >= 0, 0 <= k <= n");
        }
        if (request.getP() < 0 || request.getP() > 1) {
            throw new IllegalArgumentException("Probabilidade p deve estar entre 0 e 1");
        }
    }
    
    private void validarAnaliseCombinatoria(EstatisticaRequest request) {
        if (request.getN() == null || request.getK() == null) {
            throw new IllegalArgumentException("n e k são obrigatórios");
        }
        if (request.getN() < 0 || request.getK() < 0 || request.getK() > request.getN()) {
            throw new IllegalArgumentException("Valores inválidos: n >= 0, 0 <= k <= n");
        }
    }
    
    private void validarRegressao(EstatisticaRequest request) {
        if (request.getXDados() == null || request.getYDados() == null) {
            throw new IllegalArgumentException("Os conjuntos xDados e yDados são obrigatórios");
        }
        if (request.getXDados().size() != request.getYDados().size() || request.getXDados().size() < 2) {
            throw new IllegalArgumentException("xDados e yDados devem ter o mesmo tamanho e pelo menos 2 elementos");
        }
    }
}
