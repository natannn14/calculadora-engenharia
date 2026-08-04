package br.calculaeng.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class SymbolicRequest {
    @NotBlank(message = "O campo 'task' é obrigatório")
    private String task;      // "derive", "integrate", "simplify", "solve"
    @NotBlank(message = "O campo 'expr' é obrigatório")
    private String expr;      // expressão em linguagem Symja (ex.: "x^3 * sin(x)")
    @NotBlank(message = "O campo 'variable' é obrigatório")
    private String variable;  // variável, ex.: "x"
    private String lang;      // "pt-BR" (para mensagens/passos)

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }

    public String getExpr() { return expr; }
    public void setExpr(String expr) { this.expr = expr; }

    public String getVariable() { return variable; }
    public void setVariable(String variable) { this.variable = variable; }

    public String getLang() { return lang; }
    public void setLang(String lang) { this.lang = lang; }

    private Double lowerLimit;
    private Double upperLimit;
    private Integer subintervals;

    public Double getLowerLimit() { return lowerLimit; }
    public void setLowerLimit(Double lowerLimit) { this.lowerLimit = lowerLimit; }

    public Double getUpperLimit() { return upperLimit; }
    public void setUpperLimit(Double upperLimit) { this.upperLimit = upperLimit; }

    public Integer getSubintervals() { return subintervals; }
    public void setSubintervals(Integer subintervals) { this.subintervals = subintervals; }
}
