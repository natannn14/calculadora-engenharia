package br.calculaeng.backend.dto;

import java.util.List;

public class ComplexosResponse {
    private String resultado;
    private String detalhes;
    private List<String> passos;

    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }

    public String getDetalhes() { return detalhes; }
    public void setDetalhes(String detalhes) { this.detalhes = detalhes; }

    public List<String> getPassos() { return passos; }
    public void setPassos(List<String> passos) { this.passos = passos; }
}
