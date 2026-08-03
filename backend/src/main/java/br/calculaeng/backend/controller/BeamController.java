package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.BeamRequest;
import br.calculaeng.backend.dto.BeamResponse;
import br.calculaeng.backend.service.BeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "http://localhost:5173")
public class BeamController {

    private final BeamService beamService;

    public BeamController(BeamService beamService) {
        this.beamService = beamService;
    }

    @PostMapping("/beam")
    public ResponseEntity<?> calculateBeam(@RequestBody BeamRequest request) {
        try {
            BeamResponse response = beamService.calculate(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(java.util.Map.of("error", "Erro no cálculo: " + e.getMessage()));
        }
    }
}
