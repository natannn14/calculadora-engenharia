package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.BeamRequest;
import br.calculaeng.backend.dto.EngineResultDto;
import br.calculaeng.backend.service.BeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/templates")
public class BeamController {
    private final BeamService beamService;

    public BeamController(BeamService beamService) {
        this.beamService = beamService;
    }

    @PostMapping("/beam")
    public ResponseEntity<EngineResultDto> calculateBeam(@jakarta.validation.Valid @RequestBody BeamRequest request) {
        EngineResultDto response = beamService.calculate(request);
        return ResponseEntity.ok(response);
    }
}
