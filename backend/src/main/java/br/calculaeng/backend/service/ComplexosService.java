package br.calculaeng.backend.service;

import br.calculaeng.backend.dto.ComplexosRequest;
import br.calculaeng.backend.dto.ComplexosResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ComplexosService {

    public ComplexosResponse process(ComplexosRequest req) {
        ComplexosResponse resp = new ComplexosResponse();
        List<String> passos = new ArrayList<>();

        double r1 = req.getReal1() != null ? req.getReal1() : 0.0;
        double i1 = req.getImag1() != null ? req.getImag1() : 0.0;
        double r2 = req.getReal2() != null ? req.getReal2() : 0.0;
        double i2 = req.getImag2() != null ? req.getImag2() : 0.0;
        double mod = req.getModulo() != null ? req.getModulo() : 0.0;
        double arg = req.getArgumento() != null ? req.getArgumento() : 0.0; // degrees

        String res = "";
        String details = "";

        switch (req.getOperacao()) {
            case "add":
                res = formatComplex(r1 + r2, i1 + i2);
                passos.add(String.format("Z1 = %s", formatComplex(r1, i1)));
                passos.add(String.format("Z2 = %s", formatComplex(r2, i2)));
                passos.add(String.format("Soma: (%f + %f) + j(%f + %f)", r1, r2, i1, i2));
                break;
            case "sub":
                res = formatComplex(r1 - r2, i1 - i2);
                passos.add(String.format("Z1 = %s", formatComplex(r1, i1)));
                passos.add(String.format("Z2 = %s", formatComplex(r2, i2)));
                passos.add(String.format("Subtração: (%f - %f) + j(%f - %f)", r1, r2, i1, i2));
                break;
            case "mul":
                double mulR = r1 * r2 - i1 * i2;
                double mulI = r1 * i2 + r2 * i1;
                res = formatComplex(mulR, mulI);
                passos.add(String.format("Z1 = %s", formatComplex(r1, i1)));
                passos.add(String.format("Z2 = %s", formatComplex(r2, i2)));
                passos.add("Multiplicação: (r1*r2 - i1*i2) + j(r1*i2 + r2*i1)");
                break;
            case "div":
                double denom = r2 * r2 + i2 * i2;
                if (denom == 0) {
                    throw new IllegalArgumentException("Divisão por zero: Z2 é nulo.");
                }
                double divR = (r1 * r2 + i1 * i2) / denom;
                double divI = (i1 * r2 - r1 * i2) / denom;
                res = formatComplex(divR, divI);
                passos.add(String.format("Z1 = %s", formatComplex(r1, i1)));
                passos.add(String.format("Z2 = %s", formatComplex(r2, i2)));
                passos.add("Divisão Z1/Z2 multiplicando pelo conjugado do denominador.");
                break;
            case "to_polar":
                double modulo = Math.sqrt(r1 * r1 + i1 * i1);
                double angRad = Math.atan2(i1, r1);
                double angDeg = Math.toDegrees(angRad);
                res = String.format(java.util.Locale.US, "%.4f ∠ %.4f°", modulo, angDeg);
                details = String.format(java.util.Locale.US, "Exponencial: %.4f * e^(j%.4f°)", modulo, angDeg);
                passos.add(String.format("Z = %s", formatComplex(r1, i1)));
                passos.add("Módulo = sqrt(r² + i²)");
                passos.add("Argumento = atan2(i, r) em graus");
                break;
            case "to_rect":
                double argRad = Math.toRadians(arg);
                double rectR = mod * Math.cos(argRad);
                double rectI = mod * Math.sin(argRad);
                res = formatComplex(rectR, rectI);
                passos.add(String.format(java.util.Locale.US, "Forma Polar: %.4f ∠ %.4f°", mod, arg));
                passos.add("Z = M * cos(θ) + j M * sin(θ)");
                break;
            default:
                throw new IllegalArgumentException("Operação inválida para números complexos");
        }

        resp.setResultado(res);
        resp.setDetalhes(details);
        resp.setPassos(passos);
        return resp;
    }

    private String formatComplex(double r, double i) {
        if (Math.abs(r) < 1e-10) r = 0.0;
        if (Math.abs(i) < 1e-10) i = 0.0;

        if (r == 0 && i == 0) return "0";
        if (r == 0) return String.format(java.util.Locale.US, "j%.4f", i);
        if (i == 0) return String.format(java.util.Locale.US, "%.4f", r);
        
        if (i < 0) {
            return String.format(java.util.Locale.US, "%.4f - j%.4f", r, -i);
        } else {
            return String.format(java.util.Locale.US, "%.4f + j%.4f", r, i);
        }
    }
}
