package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.EngineResultDto;
import br.calculaeng.backend.dto.EngineWarningDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Collections;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<EngineResultDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String msg;
        if (ex.getBindingResult().hasFieldErrors()) {
             msg = "Parâmetro inválido ou obrigatório: " + ex.getBindingResult().getFieldError().getField();
        } else {
             msg = "Erro de validação nos dados fornecidos.";
        }
        
        return buildErrorResponse(msg);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<EngineResultDto> handleIllegalArgumentException(IllegalArgumentException ex) {
        return buildErrorResponse(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<EngineResultDto> handleGenericException(Exception ex) {
        return buildErrorResponse("Erro inesperado no servidor: " + ex.getMessage());
    }

    private ResponseEntity<EngineResultDto> buildErrorResponse(String message) {
        EngineWarningDto warning = EngineWarningDto.builder()
                .code("ERROR")
                .message(message)
                .severity("ERROR")
                .build();

        EngineResultDto result = EngineResultDto.builder()
                .result("Erro no cálculo")
                .warnings(Collections.singletonList(warning))
                .build();

        return ResponseEntity.badRequest().body(result);
    }
}
