package br.calculaeng.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngineResultDto {
    private Object result; // String or Number
    private String resultUnit;
    private List<EngineVariableDto> intermediateResults;
    private String usedFormulaId;
    private List<EngineStepDto> calculationSteps;
    private List<EngineWarningDto> warnings;
    private List<String> assumptions;
    private List<String> references;
    private List<EngineGraphDto> graphs;
    private Map<String, Object> metadata;
}
