package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.SymbolicRequest;
import br.calculaeng.backend.dto.SymbolicResponse;
import br.calculaeng.backend.service.SymbolicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class CalculadoraController {

    private final SymbolicService symbolicService;

    public CalculadoraController(SymbolicService symbolicService) {
        this.symbolicService = symbolicService;
    }

    @PostMapping("/symbolic")
    public ResponseEntity<?> symbolic(@RequestBody SymbolicRequest request) {
        try {
            SymbolicResponse response = symbolicService.process(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(org.springframework.http.HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Parâmetro inválido: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(org.springframework.http.HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Não foi possível calcular: " + (e.getCause() != null ? e.getCause().getMessage() : e.getMessage())));
        }
    }
}
