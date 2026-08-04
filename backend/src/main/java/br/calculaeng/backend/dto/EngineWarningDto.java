package br.calculaeng.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngineWarningDto {
    private String code;
    private String message;
    private String severity; // 'INFO', 'WARNING', 'ERROR'
}
