package br.calculaeng.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngineVariableDto {
    private String symbol;
    private String name;
    private Object value; // Can be number or string
    private String unit;
    private String description;
}
