package br.calculaeng.backend.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculadoraBasicaServiceTest {

    private final CalculadoraBasicaService service = new CalculadoraBasicaService();

    @Test
    public void testDivisaoPorZero() {
        Exception exception = assertThrows(ArithmeticException.class, () -> service.dividir(10, 0));
        assertEquals("Divisão por zero", exception.getMessage());
    }

    @Test
    public void testFatorialNegativo() {
        Exception exception = assertThrows(ArithmeticException.class, () -> service.fatorial(-5));
        assertEquals("Fatorial de número negativo", exception.getMessage());
    }

    @Test
    public void testRaizNegativa() {
        Exception exception = assertThrows(ArithmeticException.class, () -> service.raizQuadrada(-9));
        assertEquals("Raiz quadrada de número negativo", exception.getMessage());
    }

    @Test
    public void testOperacoesBasicas() {
        assertEquals(15.0, service.somar(10, 5));
        assertEquals(5.0, service.subtrair(10, 5));
        assertEquals(50.0, service.multiplicar(10, 5));
        assertEquals(2.0, service.dividir(10, 5));
        assertEquals(5.0, service.porcentagem(50, 10));
        assertEquals(3.0, service.raizQuadrada(9));
        assertEquals(120, service.fatorial(5));
    }
}
