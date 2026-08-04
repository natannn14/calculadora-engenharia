package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.EngineResultDto;
import br.calculaeng.backend.dto.EngineStepDto;
import br.calculaeng.backend.dto.SymbolicRequest;
import br.calculaeng.backend.dto.SymbolicResponse;
import br.calculaeng.backend.service.SymbolicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/symbolic")
public class SymbolicController {

    private final SymbolicService symbolicService;

    public SymbolicController(SymbolicService symbolicService) {
        this.symbolicService = symbolicService;
    }

    @PostMapping
    public ResponseEntity<EngineResultDto> calculate(@RequestBody SymbolicRequest request) {
        try {
            SymbolicResponse response = symbolicService.calculate(request);
            
            EngineResultDto resultDto = new EngineResultDto();
            resultDto.setResultado(response.getResult());
            
            if (response.getSteps() != null) {
                List<EngineStepDto> steps = new ArrayList<>();
                for (int i = 0; i < response.getSteps().size(); i++) {
                    EngineStepDto step = new EngineStepDto();
                    step.setIndex(i + 1);
                    step.setDescription(response.getSteps().get(i));
                    steps.add(step);
                }
                resultDto.setCalculationSteps(steps);
            }
            
            return ResponseEntity.ok(resultDto);
        } catch (IllegalArgumentException e) {
            EngineResultDto errorDto = new EngineResultDto();
            errorDto.setResultado("Erro");
            EngineResultDto.EngineWarningDto warning = new EngineResultDto.EngineWarningDto();
            warning.setCode("BAD_REQUEST");
            warning.setMessage(e.getMessage());
            warning.setSeverity("ERROR");
            errorDto.setWarnings(List.of(warning));
            return ResponseEntity.badRequest().body(errorDto);
        } catch (Exception e) {
            EngineResultDto errorDto = new EngineResultDto();
            errorDto.setResultado("Erro");
            EngineResultDto.EngineWarningDto warning = new EngineResultDto.EngineWarningDto();
            warning.setCode("INTERNAL_ERROR");
            warning.setMessage(e.getMessage());
            warning.setSeverity("ERROR");
            errorDto.setWarnings(List.of(warning));
            return ResponseEntity.status(500).body(errorDto);
        }
    }
}
