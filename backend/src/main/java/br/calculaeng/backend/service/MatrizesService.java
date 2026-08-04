package br.calculaeng.backend.service;

import org.matheclipse.core.eval.ExprEvaluator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatrizesService {

    private String toSymjaMatrix(List<List<Double>> matrix) {
        if (matrix == null) return "{}";
        String rows = matrix.stream()
                .map(row -> "{" + row.stream().map(String::valueOf).collect(Collectors.joining(", ")) + "}")
                .collect(Collectors.joining(", "));
        return "{" + rows + "}";
    }

    private String toSymjaVector(List<Double> vector) {
        if (vector == null) return "{}";
        return "{" + vector.stream().map(String::valueOf).collect(Collectors.joining(", ")) + "}";
    }

    private String evaluate(String expression) {
        ExprEvaluator evaluator = new ExprEvaluator(); // thread-safe, new instance per request
        try {
            return evaluator.evaluate(expression).toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar cálculo na engine simbólica: " + e.getMessage());
        }
    }

    public String somarMatrizes(List<List<Double>> a, List<List<Double>> b) {
        String expr = toSymjaMatrix(a) + " + " + toSymjaMatrix(b);
        return evaluate(expr);
    }

    public String subtrairMatrizes(List<List<Double>> a, List<List<Double>> b) {
        String expr = toSymjaMatrix(a) + " - " + toSymjaMatrix(b);
        return evaluate(expr);
    }

    public String multiplicarMatrizes(List<List<Double>> a, List<List<Double>> b) {
        String expr = "Dot[" + toSymjaMatrix(a) + ", " + toSymjaMatrix(b) + "]";
        return evaluate(expr);
    }

    public String determinante(List<List<Double>> a) {
        String expr = "Det[" + toSymjaMatrix(a) + "]";
        return evaluate(expr);
    }

    public String inversa(List<List<Double>> a) {
        String expr = "Inverse[" + toSymjaMatrix(a) + "]";
        return evaluate(expr);
    }

    public String transposta(List<List<Double>> a) {
        String expr = "Transpose[" + toSymjaMatrix(a) + "]";
        return evaluate(expr);
    }

    public String autovalores(List<List<Double>> a) {
        String expr = "Eigenvalues[" + toSymjaMatrix(a) + "]";
        return evaluate(expr);
    }

    public String autovetores(List<List<Double>> a) {
        String expr = "Eigenvectors[" + toSymjaMatrix(a) + "]";
        return evaluate(expr);
    }

    public String produtoEscalar(List<Double> u, List<Double> v) {
        String expr = "Dot[" + toSymjaVector(u) + ", " + toSymjaVector(v) + "]";
        return evaluate(expr);
    }

    public String produtoVetorial(List<Double> u, List<Double> v) {
        String expr = "Cross[" + toSymjaVector(u) + ", " + toSymjaVector(v) + "]";
        return evaluate(expr);
    }

    public String norma(List<Double> u) {
        String expr = "Norm[" + toSymjaVector(u) + "]";
        return evaluate(expr);
    }

    public String resolverSistema(List<List<Double>> a, List<Double> b) {
        String expr = "LinearSolve[" + toSymjaMatrix(a) + ", " + toSymjaVector(b) + "]";
        return evaluate(expr);
    }
}
