package br.calculaeng.backend.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculadoraCientificaServiceTest {

    private final CalculadoraCientificaService service = new CalculadoraCientificaService();

    @Test
    public void testTrigonometria() {
        // sen(30°) = 0.5
        assertEquals(0.5, service.seno(30, true), 0.0001);
        // cos(60°) = 0.5
        assertEquals(0.5, service.cosseno(60, true), 0.0001);
    }

    @Test
    public void testLogaritmos() {
        // ln(e) = 1
        assertEquals(1.0, service.ln(Math.E), 0.0001);
        // log10(100) = 2
        assertEquals(2.0, service.log10(100), 0.0001);
    }
}
