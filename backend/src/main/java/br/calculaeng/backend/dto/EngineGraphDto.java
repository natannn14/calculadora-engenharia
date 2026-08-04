package br.calculaeng.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngineGraphDto {
    private String type; // 'LINE', 'BAR', 'SCATTER', 'BEAM_DIAGRAM', 'VECTOR', 'MATRIX'
    private Object data; // Any data structure
    private Object options; // Record<string, unknown>
}
