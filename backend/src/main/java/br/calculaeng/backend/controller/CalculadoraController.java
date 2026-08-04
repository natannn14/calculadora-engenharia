package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.SymbolicRequest;
import br.calculaeng.backend.dto.SymbolicResponse;
import br.calculaeng.backend.service.SymbolicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CalculadoraController {

    private final SymbolicService symbolicService;

    public CalculadoraController(SymbolicService symbolicService) {
        this.symbolicService = symbolicService;
    }

    @PostMapping("/symbolic")
    public ResponseEntity<SymbolicResponse> symbolic(@jakarta.validation.Valid @RequestBody SymbolicRequest request) {
        SymbolicResponse response = symbolicService.process(request);
        return ResponseEntity.ok(response);
    }
}
