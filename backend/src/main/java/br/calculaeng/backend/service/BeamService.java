package br.calculaeng.backend.service;

import br.calculaeng.backend.dto.BeamRequest;
import br.calculaeng.backend.dto.BeamResponse;
import br.calculaeng.backend.dto.BeamResponse.ValueUnit;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Serviço para cálculo de viga bi-apoiada com carga uniformemente distribuída.
 *
 * Fórmulas usadas (Resistência dos Materiais):
 *   W = w * L                    (carga total)
 *   RA = RB = W / 2              (reações por simetria)
 *   V(x) = RA - w * x            (cortante)
 *   M(x) = RA * x - w * x² / 2  (momento fletor)
 *   Mmax = w * L² / 8            (momento máximo, no centro)
 */
@Service
public class BeamService {

    public BeamResponse calculate(BeamRequest req) {
        double L = req.getSpan().getValue();
        double w = req.getLoad().getValue();
        String spanUnit = req.getSpan().getUnit() != null ? req.getSpan().getUnit() : "m";
        String loadUnit = req.getLoad().getUnit() != null ? req.getLoad().getUnit() : "kN/m";

        if (L <= 0) throw new IllegalArgumentException("O vão (L) deve ser positivo.");
        if (w <= 0) throw new IllegalArgumentException("A carga (w) deve ser positiva.");

        // Carga total
        double W = w * L;

        // Reações (simetria)
        double RA = W / 2.0;
        double RB = W / 2.0;

        // Momento máximo no centro
        double Mmax = w * L * L / 8.0;

        // Cortante máximo (nos apoios)
        double Vmax = RA;

        // Unidade de força
        String forceUnit = loadUnit.replace("/m", "").replace("/ft", "");
        // Unidade de momento
        String momentUnit = forceUnit + "·" + spanUnit;

        // Passos didáticos
        List<String> steps = new ArrayList<>();
        steps.add(String.format("Dados: L = %.2f %s, w = %.2f %s", L, spanUnit, w, loadUnit));
        steps.add(String.format("Carga total: W = w × L = %.2f × %.2f = %.2f %s", w, L, W, forceUnit));
        steps.add(String.format("Por simetria: RA = RB = W / 2 = %.2f / 2 = %.2f %s", W, RA, forceUnit));
        steps.add(String.format("Cortante máximo (nos apoios): Vmax = RA = %.2f %s", Vmax, forceUnit));
        steps.add(String.format("Momento máximo (no centro): Mmax = w × L² / 8 = %.2f × %.2f² / 8 = %.2f %s", w, L, Mmax, momentUnit));

        // Diagramas de momento fletor e cortante (50 pontos ao longo da viga)
        int n = 50;
        List<Double> positions = new ArrayList<>();
        List<Double> momentDiagram = new ArrayList<>();
        List<Double> shearDiagram = new ArrayList<>();

        for (int i = 0; i <= n; i++) {
            double x = L * i / n;
            double Mx = RA * x - w * x * x / 2.0;
            double Vx = RA - w * x;
            positions.add(Math.round(x * 1000.0) / 1000.0);
            momentDiagram.add(Math.round(Mx * 1000.0) / 1000.0);
            shearDiagram.add(Math.round(Vx * 1000.0) / 1000.0);
        }

        // Montar resposta
        BeamResponse resp = new BeamResponse();

        Map<String, ValueUnit> reactions = new LinkedHashMap<>();
        reactions.put("A", new ValueUnit(RA, forceUnit));
        reactions.put("B", new ValueUnit(RB, forceUnit));
        resp.setReactions(reactions);

        resp.setMaxMoment(new ValueUnit(Mmax, momentUnit));
        resp.setMaxShear(new ValueUnit(Vmax, forceUnit));
        resp.setSteps(steps);
        resp.setPositions(positions);
        resp.setMomentDiagram(momentDiagram);
        resp.setShearDiagram(shearDiagram);

        return resp;
    }
}
