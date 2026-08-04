package br.calculaeng.backend.service;

import br.calculaeng.backend.dto.CalculadoraCientificaRequest;
import br.calculaeng.backend.dto.EngineResultDto;
import br.calculaeng.backend.dto.EngineStepDto;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CalculadoraCientificaService {

    public EngineResultDto calcular(CalculadoraCientificaRequest req) {
        String operacao = req.getOperacao();
        
        if ("pi".equals(operacao)) return buildResult(getPi(), "π", null, null);
        if ("e".equals(operacao)) return buildResult(getE(), "e", null, null);
        if ("phi".equals(operacao)) return buildResult(getPhi(), "φ (Proporção Áurea)", null, null);

        double a = req.getA() != null ? req.getA() : 0.0;
        boolean isGraus = req.getIsGraus() != null ? req.getIsGraus() : false;
        String unidade = isGraus ? "°" : " rad";

        switch (operacao) {
            case "seno":
                return buildResult(seno(a, isGraus), String.format("sen(%.4f%s)", a, unidade), null, null);
            case "cosseno":
                return buildResult(cosseno(a, isGraus), String.format("cos(%.4f%s)", a, unidade), null, null);
            case "tangente":
                return buildResult(tangente(a, isGraus), String.format("tan(%.4f%s)", a, unidade), null, null);
            case "arcoSeno":
                return buildResult(arcoSeno(a, isGraus), String.format("arcsen(%.4f)", a), null, isGraus ? "°" : " rad");
            case "arcoCosseno":
                return buildResult(arcoCosseno(a, isGraus), String.format("arccos(%.4f)", a), null, isGraus ? "°" : " rad");
            case "arcoTangente":
                return buildResult(arcoTangente(a, isGraus), String.format("arctan(%.4f)", a), null, isGraus ? "°" : " rad");
            case "senoHiperbolico":
                return buildResult(senoHiperbolico(a), String.format("senh(%.4f)", a), null, null);
            case "cossenoHiperbolico":
                return buildResult(cossenoHiperbolico(a), String.format("cosh(%.4f)", a), null, null);
            case "tangenteHiperbolico":
                return buildResult(tangenteHiperbolico(a), String.format("tanh(%.4f)", a), null, null);
            case "log10":
                return buildResult(log10(a), String.format("log10(%.4f)", a), null, null);
            case "ln":
                return buildResult(ln(a), String.format("ln(%.4f)", a), null, null);
            case "exponencial":
                return buildResult(exponencial(a), String.format("e^(%.4f)", a), null, null);
            case "logBase":
                double base = req.getBase() != null ? req.getBase() : 10.0;
                return buildResult(logBase(a, base), String.format("log_%.4f(%.4f)", base, a), null, null);
            default:
                throw new IllegalArgumentException("Operação inválida: " + operacao);
        }
    }

    private EngineResultDto buildResult(double value, String operationDesc, String usedFormulaId, String resultUnit) {
        EngineStepDto step = EngineStepDto.builder()
                .index(1)
                .description(String.format("Calculando %s", operationDesc))
                .intermediateValue(String.valueOf(value))
                .build();

        return EngineResultDto.builder()
                .result(value)
                .resultUnit(resultUnit)
                .usedFormulaId(usedFormulaId)
                .calculationSteps(Collections.singletonList(step))
                .build();
    }

    public double seno(double angulo, boolean isGraus) {
        return Math.sin(isGraus ? Math.toRadians(angulo) : angulo);
    }

    public double cosseno(double angulo, boolean isGraus) {
        return Math.cos(isGraus ? Math.toRadians(angulo) : angulo);
    }

    public double tangente(double angulo, boolean isGraus) {
        return Math.tan(isGraus ? Math.toRadians(angulo) : angulo);
    }

    public double arcoSeno(double valor, boolean isGraus) {
        double rad = Math.asin(valor);
        return isGraus ? Math.toDegrees(rad) : rad;
    }

    public double arcoCosseno(double valor, boolean isGraus) {
        double rad = Math.acos(valor);
        return isGraus ? Math.toDegrees(rad) : rad;
    }

    public double arcoTangente(double valor, boolean isGraus) {
        double rad = Math.atan(valor);
        return isGraus ? Math.toDegrees(rad) : rad;
    }

    public double senoHiperbolico(double x) {
        return Math.sinh(x);
    }

    public double cossenoHiperbolico(double x) {
        return Math.cosh(x);
    }

    public double tangenteHiperbolico(double x) {
        return Math.tanh(x);
    }

    public double log10(double x) {
        return Math.log10(x);
    }

    public double ln(double x) {
        return Math.log(x);
    }

    public double logBase(double x, double base) {
        return Math.log(x) / Math.log(base);
    }

    public double exponencial(double x) {
        return Math.exp(x);
    }

    public double getPi() {
        return Math.PI;
    }

    public double getE() {
        return Math.E;
    }

    public double getPhi() {
        return (1 + Math.sqrt(5)) / 2;
    }
}
