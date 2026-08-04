package br.calculaeng.backend.service;

import br.calculaeng.backend.dto.SymbolicRequest;
import br.calculaeng.backend.dto.SymbolicResponse;
import org.matheclipse.core.eval.ExprEvaluator;
import org.matheclipse.core.interfaces.IExpr;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Service
public class SymbolicService {

    private final ExecutorService executor = Executors.newFixedThreadPool(4);

    private IExpr evalWithTimeout(String cmd) throws Exception {
        // Cria uma nova instância a cada avaliação para evitar concorrência/thread lock
        ExprEvaluator localEvaluator = new ExprEvaluator();
        
        Future<IExpr> future = executor.submit(() -> localEvaluator.eval(cmd));
        try {
            return future.get(5, TimeUnit.SECONDS);
        } catch (TimeoutException e) {
            future.cancel(true);
            throw new RuntimeException("Expressão muito complexa ou tempo de cálculo excedido", e);
        }
    }

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
                    resultExpr = evalWithTimeout(derivCmd);
                    steps.add("Derivar " + exprStr + " em relação a " + req.getVariable());
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "integrate":
                    String intCmd = "Integrate(" + exprStr + ", " + req.getVariable() + ")";
                    resultExpr = evalWithTimeout(intCmd);
                    steps.add("Integrar " + exprStr + " em relação a " + req.getVariable());
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "simplify":
                    resultExpr = evalWithTimeout("Simplify(" + exprStr + ")");
                    steps.add("Simplificar " + exprStr);
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "solve":
                    String solveCmd = "Solve(" + exprStr + " == 0, " + req.getVariable() + ")";
                    resultExpr = evalWithTimeout(solveCmd);
                    steps.add("Resolver " + exprStr + " == 0 para " + req.getVariable());
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "expand":
                    resultExpr = evalWithTimeout("Expand(" + exprStr + ")");
                    steps.add("Expandir " + exprStr);
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "factor":
                    resultExpr = evalWithTimeout("Factor(" + exprStr + ")");
                    steps.add("Fatorar " + exprStr);
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "limit":
                    String limCmd = "Limit(" + exprStr + ", " + req.getVariable() + "->0)";
                    resultExpr = evalWithTimeout(limCmd);
                    steps.add("Calcular limite de " + exprStr + " quando " + req.getVariable() + " → 0");
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "taylor":
                    String taylorCmd = "Series(" + exprStr + ", {" + req.getVariable() + ", 0, 5})";
                    resultExpr = evalWithTimeout(taylorCmd);
                    steps.add("Expandir " + exprStr + " em Série de Taylor ao redor de 0 (ordem 5)");
                    steps.add("Resultado: " + resultExpr.toString());
                    break;
                    
                case "partial_derivative":
                    String pDerivCmd = "D(" + exprStr + ", " + req.getVariable() + ")";
                    resultExpr = evalWithTimeout(pDerivCmd);
                    steps.add("Derivada parcial de " + exprStr + " em relação a " + req.getVariable());
                    steps.add("Resultado: " + resultExpr.toString());
                    break;
                    
                case "integral_trapezio":
                    double a = req.getLowerLimit() != null ? req.getLowerLimit() : 0.0;
                    double b = req.getUpperLimit() != null ? req.getUpperLimit() : 1.0;
                    int n = req.getSubintervals() != null ? req.getSubintervals() : 100;
                    double h = (b - a) / n;
                    String varT = req.getVariable();
                    
                    String trapCmd = String.format(java.util.Locale.US, "N(%f/2 * ((%s /. %s->%f) + 2 * Sum(%s /. %s->(%f + i*%f), {i, 1, %d}) + (%s /. %s->%f)))",
                            h, exprStr, varT, a, exprStr, varT, a, h, n - 1, exprStr, varT, b);
                            
                    resultExpr = evalWithTimeout(trapCmd);
                    steps.add(String.format("Integração Numérica (Regra do Trapézio) com n=%d subintervalos", n));
                    steps.add(String.format("Limites: a = %f, b = %f", a, b));
                    steps.add("Resultado Aproximado: " + resultExpr.toString());
                    break;
                    
                case "integral_simpson":
                    double as = req.getLowerLimit() != null ? req.getLowerLimit() : 0.0;
                    double bs = req.getUpperLimit() != null ? req.getUpperLimit() : 1.0;
                    int ns = req.getSubintervals() != null ? req.getSubintervals() : 100;
                    if (ns % 2 != 0) ns++; // Simpson requer N par
                    double hs = (bs - as) / ns;
                    String varS = req.getVariable();
                    
                    String simpCmd = String.format(java.util.Locale.US, "N(%f/3 * ((%s /. %s->%f) + 4 * Sum(%s /. %s->(%f + (2*i-1)*%f), {i, 1, %d}) + 2 * Sum(%s /. %s->(%f + 2*i*%f), {i, 1, %d}) + (%s /. %s->%f)))",
                            hs, exprStr, varS, as, exprStr, varS, as, hs, ns / 2, exprStr, varS, as, hs, (ns / 2) - 1, exprStr, varS, bs);
                            
                    resultExpr = evalWithTimeout(simpCmd);
                    steps.add(String.format("Integração Numérica (Regra de Simpson 1/3) com n=%d subintervalos", ns));
                    steps.add(String.format("Limites: a = %f, b = %f", as, bs));
                    steps.add("Resultado Aproximado: " + resultExpr.toString());
                    break;

                case "mdc":
                    resultExpr = evalWithTimeout("GCD(" + exprStr + ")");
                    steps.add("Calcular Máximo Divisor Comum de " + exprStr);
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "mmc":
                    resultExpr = evalWithTimeout("LCM(" + exprStr + ")");
                    steps.add("Calcular Mínimo Múltiplo Comum de " + exprStr);
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "fraction_to_decimal":
                    resultExpr = evalWithTimeout("N(" + exprStr + ")");
                    steps.add("Converter fração " + exprStr + " para decimal");
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "decimal_to_fraction":
                    resultExpr = evalWithTimeout("Rationalize(" + exprStr + ")");
                    steps.add("Converter decimal " + exprStr + " para fração");
                    steps.add("Resultado: " + resultExpr.toString());
                    break;

                case "solve_system":
                    // Exemplo: exprStr = "{x+y==10, x-y==2}" and req.getVariable() = "{x,y}"
                    String solveSysCmd = "Solve(" + exprStr + ", " + req.getVariable() + ")";
                    resultExpr = evalWithTimeout(solveSysCmd);
                    steps.add("Resolver sistema: " + exprStr + " para as variáveis " + req.getVariable());
                    steps.add("Resultado (estruturado via Symja): " + resultExpr.toString());
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
