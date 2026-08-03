package br.calculaeng.backend.service;

import br.calculaeng.backend.dto.SymbolicRequest;
import br.calculaeng.backend.dto.SymbolicResponse;
import org.matheclipse.core.eval.ExprEvaluator;
import org.matheclipse.core.interfaces.IExpr;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SymbolicService {

    private final ExprEvaluator evaluator = new ExprEvaluator();

    private String normalize(String expr) {
        if (expr == null) return "";
        return expr.replaceAll("(?i)\\btg\\b", "tan")
                   .replaceAll("(?i)\\bsen\\b", "sin")
                   .replaceAll("(?i)\\bln\\b", "log")
                   .replaceAll("(?i)\\barcsen\\b", "arcsin")
                   .replaceAll("(?i)\\barctg\\b", "arctan");
    }

    public SymbolicResponse process(SymbolicRequest req) {
        SymbolicResponse resp = new SymbolicResponse();
        resp.setInput(req.getExpr());
        resp.setTask(req.getTask());

        IExpr resultExpr;
        List<String> steps = new ArrayList<>();

        try {
            String exprStr = normalize(req.getExpr());
            
            switch (req.getTask()) {
                case "derive":
                    String derivCmd = "D(" + exprStr + ", " + req.getVariable() + ")";
                    resultExpr = evaluator.eval(derivCmd);
                    steps.add("Derivar " + exprStr + " em relação a " + req.getVariable());
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "integrate":
                    String intCmd = "Integrate(" + exprStr + ", " + req.getVariable() + ")";
                    resultExpr = evaluator.eval(intCmd);
                    steps.add("Integrar " + exprStr + " em relação a " + req.getVariable());
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "simplify":
                    resultExpr = evaluator.eval("Simplify(" + exprStr + ")");
                    steps.add("Simplificar " + exprStr);
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "solve":
                    String solveCmd = "Solve(" + exprStr + " == 0, " + req.getVariable() + ")";
                    resultExpr = evaluator.eval(solveCmd);
                    steps.add("Resolver " + exprStr + " == 0 para " + req.getVariable());
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "expand":
                    resultExpr = evaluator.eval("Expand(" + exprStr + ")");
                    steps.add("Expandir " + exprStr);
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "factor":
                    resultExpr = evaluator.eval("Factor(" + exprStr + ")");
                    steps.add("Fatorar " + exprStr);
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "limit":
                    String limCmd = "Limit(" + exprStr + ", " + req.getVariable() + "->0)";
                    resultExpr = evaluator.eval(limCmd);
                    steps.add("Calcular limite de " + exprStr + " quando " + req.getVariable() + " → 0");
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "taylor":
                    String taylorCmd = "Series(" + exprStr + ", {" + req.getVariable() + ", 0, 5})";
                    resultExpr = evaluator.eval(taylorCmd);
                    steps.add("Série de Taylor de " + exprStr + " em torno de " + req.getVariable() + " = 0, ordem 5");
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                default:
                    throw new IllegalArgumentException("Tarefa desconhecida: " + req.getTask());
            }

            resp.setResult(resultExpr.toString());
            resp.setSteps(steps);
            return resp;
            
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage() != null ? e.getMessage() : "Expressão inválida", e);
        }
    }
}
