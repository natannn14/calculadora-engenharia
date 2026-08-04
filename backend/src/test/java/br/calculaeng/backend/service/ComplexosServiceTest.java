package br.calculaeng.backend.service;

import br.calculaeng.backend.dto.ComplexosRequest;
import br.calculaeng.backend.dto.ComplexosResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ComplexosServiceTest {

    private ComplexosService service;

    @BeforeEach
    void setUp() {
        service = new ComplexosService();
    }

    @Test
    void testAdd() {
        ComplexosRequest req = new ComplexosRequest();
        req.setOperacao("add");
        req.setReal1(3.0);
        req.setImag1(4.0);
        req.setReal2(1.0);
        req.setImag2(-2.0);

        ComplexosResponse resp = service.process(req);
        assertEquals("4.0000 + j2.0000", resp.getResultado());
        assertFalse(resp.getPassos().isEmpty());
    }

    @Test
    void testSub() {
        ComplexosRequest req = new ComplexosRequest();
        req.setOperacao("sub");
        req.setReal1(3.0);
        req.setImag1(4.0);
        req.setReal2(1.0);
        req.setImag2(-2.0);

        ComplexosResponse resp = service.process(req);
        assertEquals("2.0000 + j6.0000", resp.getResultado());
    }

    @Test
    void testMul() {
        ComplexosRequest req = new ComplexosRequest();
        req.setOperacao("mul");
        req.setReal1(1.0);
        req.setImag1(2.0);
        req.setReal2(3.0);
        req.setImag2(4.0);

        ComplexosResponse resp = service.process(req);
        assertEquals("-5.0000 + j10.0000", resp.getResultado());
    }

    @Test
    void testDiv() {
        ComplexosRequest req = new ComplexosRequest();
        req.setOperacao("div");
        req.setReal1(1.0);
        req.setImag1(2.0);
        req.setReal2(3.0);
        req.setImag2(4.0);

        ComplexosResponse resp = service.process(req);
        assertEquals("0.4400 + j0.0800", resp.getResultado());
    }
    
    @Test
    void testToPolar() {
        ComplexosRequest req = new ComplexosRequest();
        req.setOperacao("to_polar");
        req.setReal1(3.0);
        req.setImag1(4.0);

        ComplexosResponse resp = service.process(req);
        assertEquals("5.0000 ∠ 53.1301°", resp.getResultado());
    }

    @Test
    void testToRect() {
        ComplexosRequest req = new ComplexosRequest();
        req.setOperacao("to_rect");
        req.setModulo(5.0);
        req.setArgumento(53.13010235415598);

        ComplexosResponse resp = service.process(req);
        // Note: double precision formatting gives exactly 3.0000 + j4.0000
        assertEquals("3.0000 + j4.0000", resp.getResultado());
    }
}
