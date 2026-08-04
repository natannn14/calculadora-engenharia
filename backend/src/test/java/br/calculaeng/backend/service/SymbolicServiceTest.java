package br.calculaeng.backend.service;

import br.calculaeng.backend.dto.SymbolicRequest;
import br.calculaeng.backend.dto.SymbolicResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SymbolicServiceTest {

    private final SymbolicService service = new SymbolicService();

    @Test
    public void testSolveLinearSystem() {
        SymbolicRequest req = new SymbolicRequest();
        req.setTask("solve_system");
        req.setExpr("{x+y==10, x-y==2}");
        req.setVariable("{x,y}");
        
        SymbolicResponse resp = service.process(req);
        assertNotNull(resp.getResult());
        assertTrue(resp.getResult().contains("x->6"));
        assertTrue(resp.getResult().contains("y->4"));
    }

    @Test
    public void testSolveQuadraticComplexRoots() {
        SymbolicRequest req = new SymbolicRequest();
        req.setTask("solve");
        req.setExpr("x^2 + 4"); // delta < 0
        req.setVariable("x");
        
        SymbolicResponse resp = service.process(req);
        assertTrue(resp.getResult().contains("I")); // Symja uses I for imaginary unit
    }

    @Test
    public void testMDC() {
        SymbolicRequest req = new SymbolicRequest();
        req.setTask("mdc");
        req.setExpr("48, 18");
        req.setVariable("x");
        
        SymbolicResponse resp = service.process(req);
        assertEquals("6", resp.getResult());
    }

    @Test
    public void testDecimalToFraction() {
        SymbolicRequest req = new SymbolicRequest();
        req.setTask("decimal_to_fraction");
        req.setExpr("0.75");
        req.setVariable("x");
        
        SymbolicResponse resp = service.process(req);
        assertEquals("3/4", resp.getResult());
    }
}
