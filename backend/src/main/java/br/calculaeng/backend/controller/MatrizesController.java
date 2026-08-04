package br.calculaeng.backend.controller;

import br.calculaeng.backend.dto.MatrizesRequest;
import br.calculaeng.backend.service.MatrizesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/matrizes")
public class MatrizesController {

    @Autowired
    private MatrizesService service;

    @PostMapping("/calcular")
    public ResponseEntity<?> calcular(@Valid @RequestBody MatrizesRequest req) {
        try {
            String resultado;
            switch (req.getOperacao()) {
                case "somaMatriz":
                    resultado = service.somarMatrizes(req.getMatrizA(), req.getMatrizB());
                    break;
                case "subtracaoMatriz":
                    resultado = service.subtrairMatrizes(req.getMatrizA(), req.getMatrizB());
                    break;
                case "multiplicacaoMatriz":
                    resultado = service.multiplicarMatrizes(req.getMatrizA(), req.getMatrizB());
                    break;
                case "determinante":
                    resultado = service.determinante(req.getMatrizA());
                    break;
                case "inversa":
                    resultado = service.inversa(req.getMatrizA());
                    break;
                case "transposta":
                    resultado = service.transposta(req.getMatrizA());
                    break;
                case "autovalores":
                    resultado = service.autovalores(req.getMatrizA());
                    break;
                case "autovetores":
                    resultado = service.autovetores(req.getMatrizA());
                    break;
                case "produtoEscalar":
                    resultado = service.produtoEscalar(req.getVetorU(), req.getVetorV());
                    break;
                case "produtoVetorial":
                    resultado = service.produtoVetorial(req.getVetorU(), req.getVetorV());
                    break;
                case "norma":
                    resultado = service.norma(req.getVetorU());
                    break;
                case "resolverSistema":
                    resultado = service.resolverSistema(req.getMatrizA(), req.getVetorV());
                    break;
                default:
                    return ResponseEntity.badRequest().body(Map.of("erro", "Operação inválida"));
            }
            return ResponseEntity.ok(Map.of("resultado", resultado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
