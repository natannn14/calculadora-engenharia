package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.ComplexosRequest;
import br.calculaeng.backend.dto.ComplexosResponse;
import br.calculaeng.backend.service.ComplexosService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/complexos")
public class ComplexosController {

    private final ComplexosService complexosService;

    public ComplexosController(ComplexosService complexosService) {
        this.complexosService = complexosService;
    }

    @PostMapping
    public ResponseEntity<ComplexosResponse> calcular(@Valid @RequestBody ComplexosRequest req) {
        ComplexosResponse resp = complexosService.process(req);
        return ResponseEntity.ok(resp);
    }
}
