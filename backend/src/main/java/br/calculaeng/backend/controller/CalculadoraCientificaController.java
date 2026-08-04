package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.CalculadoraCientificaRequest;
import br.calculaeng.backend.dto.EngineResultDto;
import br.calculaeng.backend.service.CalculadoraCientificaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cientifico")
public class CalculadoraCientificaController {

    @Autowired
    private CalculadoraCientificaService service;

    @PostMapping("/calcular")
    public ResponseEntity<EngineResultDto> calcular(@Valid @RequestBody CalculadoraCientificaRequest req) {
        EngineResultDto result = service.calcular(req);
        return ResponseEntity.ok(result);
    }
}
