package dev.nataborges.calculadora.service;

import dev.nataborges.calculadora.model.Operacao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class CalculadoraServiceTest {

    private CalculadoraService service;

    @BeforeEach
    void setUp() {
        service = new CalculadoraService();
    }

    @Test
    void deveSomarDoisNumeros() {
        double resultado = service.calcular(5, 3, Operacao.SOMA);
        assertEquals(8.0, resultado, "A soma de 5 e 3 deve ser 8.0");
    }

    @Test
    void deveSubtrairDoisNumeros() {
        double resultado = service.calcular(10, 4, Operacao.SUBTRACAO);
        assertEquals(6.0, resultado, "A subtração de 10 por 4 deve ser 6.0");
    }

    @Test
    void deveMultiplicarDoisNumeros() {
        double resultado = service.calcular(2.5, 4, Operacao.MULTIPLICACAO);
        assertEquals(10.0, resultado, "A multiplicação de 2.5 por 4 deve ser 10.0");
    }

    @Test
    void deveDividirDoisNumeros() {
        double resultado = service.calcular(20, 5, Operacao.DIVISAO);
        assertEquals(4.0, resultado, "A divisão de 20 por 5 deve ser 4.0");
    }

    @Test
    void deveLancarExcecaoAoDividirPorZero() {
        ArithmeticException exception = assertThrows(
                ArithmeticException.class,
                () -> service.calcular(10, 0, Operacao.DIVISAO)
        );
        assertEquals("Divisão por zero", exception.getMessage());
    }

    @Test
    void deveRetornarSegundoOperandoQuandoNenhumaOperacao() {
        double resultado = service.calcular(50, 100, Operacao.NENHUMA);
        assertEquals(100.0, resultado, "Quando não há operação, deve retornar o próprio valor digitado");
    }

    @Test
    void deveInverterSinalCorretamente() {
        assertEquals(-5.0, service.inverterSinal(5.0));
        assertEquals(5.0, service.inverterSinal(-5.0));
        assertEquals(0.0, service.inverterSinal(0.0));
    }

    @Test
    void deveCalcularPorcentagemAbsoluta() {
        double resultado = service.calcularPorcentagem(50, 10, Operacao.MULTIPLICACAO);
        assertEquals(0.1, resultado, "Em multiplicações/divisões, 10% equivale a 0.1 absoluto");
    }

    @Test
    void deveCalcularPorcentagemRelativaABase() {
        double resultadoSoma = service.calcularPorcentagem(50, 10, Operacao.SOMA);
        assertEquals(5.0, resultadoSoma, "Na soma, 10% de 50 deve ser 5.0");

        double resultadoSub = service.calcularPorcentagem(200, 20, Operacao.SUBTRACAO);
        assertEquals(40.0, resultadoSub, "Na subtração, 20% de 200 deve ser 40.0");
    }
}
