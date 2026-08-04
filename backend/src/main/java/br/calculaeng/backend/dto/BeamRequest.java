package br.calculaeng.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;

public class BeamRequest {

    @Valid
    @NotNull(message = "O campo 'span' é obrigatório")
    private Measurement span;
    
    @Valid
    @NotNull(message = "O campo 'load' é obrigatório")
    private Measurement load;

    public Measurement getSpan() { return span; }
    public void setSpan(Measurement span) { this.span = span; }

    public Measurement getLoad() { return load; }
    public void setLoad(Measurement load) { this.load = load; }

    public static class Measurement {
        private double value;
        @NotBlank(message = "A unidade é obrigatória")
        private String unit;

        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
    }
}
