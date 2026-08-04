package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.EstatisticaRequest;
import br.calculaeng.backend.services.EstatisticaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/estatistica")
@CrossOrigin(origins = "*") // Para permitir chamadas do frontend
public class EstatisticaController {

    private final EstatisticaService service;

    @Autowired
    public EstatisticaController(EstatisticaService service) {
        this.service = service;
    }

    @PostMapping("/calcular")
    public ResponseEntity<Map<String, Object>> calcular(@Valid @RequestBody EstatisticaRequest request) {
        Map<String, Object> resultado = service.calcular(request);
        if (resultado.containsKey("erro")) {
            return ResponseEntity.badRequest().body(resultado);
        }
        return ResponseEntity.ok(resultado);
    }
}
