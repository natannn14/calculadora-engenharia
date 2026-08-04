package br.calculaeng.backend.service;

import br.calculaeng.backend.dto.BeamRequest;
import br.calculaeng.backend.dto.EngineGraphDto;
import br.calculaeng.backend.dto.EngineResultDto;
import br.calculaeng.backend.dto.EngineStepDto;
import br.calculaeng.backend.dto.EngineVariableDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BeamService {
    public EngineResultDto calculate(BeamRequest req) {
        double L = req.getSpan().getValue();
        double w = req.getLoad().getValue();
        String spanUnit = req.getSpan().getUnit() != null ? req.getSpan().getUnit() : "m";
        String loadUnit = req.getLoad().getUnit() != null ? req.getLoad().getUnit() : "kN/m";

        if (L <= 0) throw new IllegalArgumentException("O vão (L) deve ser positivo.");
        if (w <= 0) throw new IllegalArgumentException("A carga (w) deve ser positiva.");

        double W = w * L;
        double RA = W / 2.0;
        double RB = W / 2.0;
        double Mmax = w * L * L / 8.0;
        double Vmax = RA;

        String forceUnit = loadUnit.replace("/m", "").replace("/ft", "");
        String momentUnit = forceUnit + "·" + spanUnit;

        List<EngineStepDto> steps = new ArrayList<>();
        steps.add(EngineStepDto.builder().index(1).description(String.format("Dados: L = %.2f %s, w = %.2f %s", L, spanUnit, w, loadUnit)).build());
        steps.add(EngineStepDto.builder().index(2).description(String.format("Carga total: W = w × L = %.2f × %.2f = %.2f %s", w, L, W, forceUnit)).build());
        steps.add(EngineStepDto.builder().index(3).description(String.format("Por simetria: RA = RB = W / 2 = %.2f / 2 = %.2f %s", W, RA, forceUnit)).build());
        steps.add(EngineStepDto.builder().index(4).description(String.format("Cortante máximo (nos apoios): Vmax = RA = %.2f %s", Vmax, forceUnit)).build());
        steps.add(EngineStepDto.builder().index(5).description(String.format("Momento máximo (no centro): Mmax = w × L² / 8 = %.2f × %.2f² / 8 = %.2f %s", w, L, Mmax, momentUnit)).build());

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

        List<EngineVariableDto> intermediateResults = new ArrayList<>();
        intermediateResults.add(EngineVariableDto.builder().symbol("RA").name("Reação no Apoio A").value(RA).unit(forceUnit).build());
        intermediateResults.add(EngineVariableDto.builder().symbol("RB").name("Reação no Apoio B").value(RB).unit(forceUnit).build());
        intermediateResults.add(EngineVariableDto.builder().symbol("Vmax").name("Esforço Cortante Máximo").value(Vmax).unit(forceUnit).build());
        intermediateResults.add(EngineVariableDto.builder().symbol("Mmax").name("Momento Fletor Máximo").value(Mmax).unit(momentUnit).build());

        Map<String, Object> graphData = new HashMap<>();
        graphData.put("positions", positions);
        graphData.put("momentDiagram", momentDiagram);
        graphData.put("shearDiagram", shearDiagram);

        EngineGraphDto graph = EngineGraphDto.builder()
                .type("BEAM_DIAGRAM")
                .data(graphData)
                .build();

        return EngineResultDto.builder()
                .result(String.format("Mmax = %.2f %s, Vmax = %.2f %s", Mmax, momentUnit, Vmax, forceUnit))
                .resultUnit("")
                .usedFormulaId("momento-fletor")
                .intermediateResults(intermediateResults)
                .calculationSteps(steps)
                .graphs(Collections.singletonList(graph))
                .assumptions(Arrays.asList("Viga bi-apoiada ideal", "Material linear elástico", "Carga uniformemente distribuída"))
                .build();
    }
}
