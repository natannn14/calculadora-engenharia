package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.CalculadoraBasicaRequest;
import br.calculaeng.backend.service.CalculadoraBasicaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/basico")
public class CalculadoraBasicaController {

    @Autowired
    private CalculadoraBasicaService service;

    @PostMapping("/calcular")
    public ResponseEntity<?> calcular(@Valid @RequestBody CalculadoraBasicaRequest req) {
        try {
            String operacao = req.getOperacao();
            double a = req.getA() != null ? req.getA() : 0.0;
            double b = req.getB() != null ? req.getB() : 0.0;
            
            // operations with 1 argument
            if ("raizQuadrada".equals(operacao)) return ResponseEntity.ok(Map.of("resultado", service.raizQuadrada(a)));
            if ("fatorial".equals(operacao)) return ResponseEntity.ok(Map.of("resultado", service.fatorial((int) a)));
            if ("inverso".equals(operacao)) return ResponseEntity.ok(Map.of("resultado", service.inverso(a)));
            if ("absoluto".equals(operacao)) return ResponseEntity.ok(Map.of("resultado", service.absoluto(a)));

            switch (operacao) {
                case "somar": return ResponseEntity.ok(Map.of("resultado", service.somar(a, b)));
                case "subtrair": return ResponseEntity.ok(Map.of("resultado", service.subtrair(a, b)));
                case "multiplicar": return ResponseEntity.ok(Map.of("resultado", service.multiplicar(a, b)));
                case "dividir": return ResponseEntity.ok(Map.of("resultado", service.dividir(a, b)));
                case "porcentagem": return ResponseEntity.ok(Map.of("resultado", service.porcentagem(a, b)));
                case "raizNesima": return ResponseEntity.ok(Map.of("resultado", service.raizNesima(a, b)));
                case "potencia": return ResponseEntity.ok(Map.of("resultado", service.potencia(a, b)));
                case "modulo": return ResponseEntity.ok(Map.of("resultado", service.modulo(a, b)));
                default: return ResponseEntity.badRequest().body(Map.of("erro", "Operação inválida"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
