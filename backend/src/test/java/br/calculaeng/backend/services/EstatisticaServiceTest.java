package br.calculaeng.backend.services;

import br.calculaeng.backend.dto.EstatisticaRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class EstatisticaServiceTest {

    private EstatisticaService service;

    @BeforeEach
    void setUp() {
        service = new EstatisticaService();
    }

    @Test
    void testMedia() {
        EstatisticaRequest req = new EstatisticaRequest();
        req.setOperacao("media");
        req.setDados(Arrays.asList(1.0, 2.0, 3.0, 4.0, 5.0));

        Map<String, Object> result = service.calcular(req);
        assertEquals(3.0, (Double) result.get("resultado"), 1e-4);
    }

    @Test
    void testModa() {
        EstatisticaRequest req = new EstatisticaRequest();
        req.setOperacao("moda");
        req.setDados(Arrays.asList(1.0, 2.0, 2.0, 3.0));

        Map<String, Object> result = service.calcular(req);
        List<Double> moda = (List<Double>) result.get("resultado");
        assertTrue(moda.contains(2.0));
        assertEquals(1, moda.size());
    }

    @Test
    void testDesvioPadraoAmostral() {
        EstatisticaRequest req = new EstatisticaRequest();
        req.setOperacao("desvio_amostral");
        req.setDados(Arrays.asList(2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0));

        Map<String, Object> result = service.calcular(req);
        assertEquals(2.13808, (Double) result.get("resultado"), 1e-4);
    }

    @Test
    void testDesvioPadraoVazio() {
        EstatisticaRequest req = new EstatisticaRequest();
        req.setOperacao("desvio_amostral");
        req.setDados(Arrays.asList(1.0)); // precisa de 2

        Map<String, Object> result = service.calcular(req);
        assertTrue(result.containsKey("erro"));
    }

    @Test
    void testNormalPDF() {
        EstatisticaRequest req = new EstatisticaRequest();
        req.setOperacao("normal_pdf");
        req.setMedia(0.0);
        req.setDesvio(1.0);
        req.setX(0.0);

        Map<String, Object> result = service.calcular(req);
        assertEquals(0.3989, (Double) result.get("resultado"), 1e-4);
    }

    @Test
    void testCombinacao() {
        EstatisticaRequest req = new EstatisticaRequest();
        req.setOperacao("combinacao");
        req.setN(5);
        req.setK(2);

        Map<String, Object> result = service.calcular(req);
        assertEquals(10.0, (Double) result.get("resultado"), 1e-4);
    }

    @Test
    void testRegressaoLinear() {
        EstatisticaRequest req = new EstatisticaRequest();
        req.setOperacao("regressao_linear");
        req.setXDados(Arrays.asList(1.0, 2.0, 3.0, 4.0, 5.0));
        req.setYDados(Arrays.asList(2.0, 4.0, 5.0, 4.0, 5.0));

        Map<String, Object> result = service.calcular(req);
        assertFalse(result.containsKey("erro"));
        Map<String, Double> coeficientes = (Map<String, Double>) result.get("resultado");
        assertEquals(0.6, coeficientes.get("b"), 1e-4); // slope
        assertEquals(2.2, coeficientes.get("a"), 1e-4); // intercept
    }
}
