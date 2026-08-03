package br.calculaeng.backend.dto;

public class BeamRequest {

    private Measurement span;
    private Measurement load;

    public Measurement getSpan() { return span; }
    public void setSpan(Measurement span) { this.span = span; }

    public Measurement getLoad() { return load; }
    public void setLoad(Measurement load) { this.load = load; }

    public static class Measurement {
        private double value;
        private String unit;

        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
    }
}
