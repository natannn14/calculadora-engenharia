package br.calculaeng.backend.dto;

import java.util.List;
import java.util.Map;

public class BeamResponse {

    private Map<String, ValueUnit> reactions;
    private ValueUnit maxMoment;
    private ValueUnit maxShear;
    private List<String> steps;
    private List<Double> momentDiagram;
    private List<Double> shearDiagram;
    private List<Double> positions;

    public Map<String, ValueUnit> getReactions() { return reactions; }
    public void setReactions(Map<String, ValueUnit> reactions) { this.reactions = reactions; }

    public ValueUnit getMaxMoment() { return maxMoment; }
    public void setMaxMoment(ValueUnit maxMoment) { this.maxMoment = maxMoment; }

    public ValueUnit getMaxShear() { return maxShear; }
    public void setMaxShear(ValueUnit maxShear) { this.maxShear = maxShear; }

    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }

    public List<Double> getMomentDiagram() { return momentDiagram; }
    public void setMomentDiagram(List<Double> momentDiagram) { this.momentDiagram = momentDiagram; }

    public List<Double> getShearDiagram() { return shearDiagram; }
    public void setShearDiagram(List<Double> shearDiagram) { this.shearDiagram = shearDiagram; }

    public List<Double> getPositions() { return positions; }
    public void setPositions(List<Double> positions) { this.positions = positions; }

    public static class ValueUnit {
        private double value;
        private String unit;

        public ValueUnit() {}
        public ValueUnit(double value, String unit) {
            this.value = value;
            this.unit = unit;
        }

        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
    }
}
