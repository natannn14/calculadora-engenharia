package br.calculaeng.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngineStepDto {
    private Integer index;
    private String description;
    private String formula; // LaTeX
    private String intermediateValue;
}
