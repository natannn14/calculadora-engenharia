package br.calculaeng.backend.dto;

import java.util.List;

public class SymbolicResponse {
    private String result;
    private String input;
    private String task;
    private List<String> steps; // passos em PT-BR (strings)

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }

    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }
}
