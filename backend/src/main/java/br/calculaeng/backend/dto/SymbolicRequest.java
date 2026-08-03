package br.calculaeng.backend.dto;

public class SymbolicRequest {
    private String task;      // "derive", "integrate", "simplify", "solve"
    private String expr;      // expressão em linguagem Symja (ex.: "x^3 * sin(x)")
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
}
