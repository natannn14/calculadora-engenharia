package br.calculaeng.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ComplexosRequest {
    
    @NotBlank(message = "A operação é obrigatória")
    private String operacao; 

    private Double real1;
    private Double imag1;
    
    private Double real2;
    private Double imag2;
    
    private Double modulo;
    private Double argumento; // in degrees

    public String getOperacao() { return operacao; }
    public void setOperacao(String operacao) { this.operacao = operacao; }

    public Double getReal1() { return real1; }
    public void setReal1(Double real1) { this.real1 = real1; }

    public Double getImag1() { return imag1; }
    public void setImag1(Double imag1) { this.imag1 = imag1; }

    public Double getReal2() { return real2; }
    public void setReal2(Double real2) { this.real2 = real2; }

    public Double getImag2() { return imag2; }
    public void setImag2(Double imag2) { this.imag2 = imag2; }

    public Double getModulo() { return modulo; }
    public void setModulo(Double modulo) { this.modulo = modulo; }

    public Double getArgumento() { return argumento; }
    public void setArgumento(Double argumento) { this.argumento = argumento; }
}
