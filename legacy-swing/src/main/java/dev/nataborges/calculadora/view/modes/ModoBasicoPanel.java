package dev.nataborges.calculadora.view.modes;

import dev.nataborges.calculadora.controller.CalculadoraController;
import dev.nataborges.calculadora.model.CalculadoraEstado;
import dev.nataborges.calculadora.view.PainelBotoes;
import dev.nataborges.calculadora.view.VisorCalculadora;

import javax.swing.*;
import java.awt.*;

public class ModoBasicoPanel extends JPanel {

    private final CalculadoraController controller;

    public ModoBasicoPanel(CalculadoraEstado estadoInicial) {
        setLayout(new BorderLayout());

        VisorCalculadora visor = new VisorCalculadora();
        this.controller = new CalculadoraController(visor, estadoInicial);
        
        PainelBotoes painelBotoes = new PainelBotoes(e -> {
            String comando = e.getActionCommand();
            if (comando.equals("×")) comando = "*";
            if (comando.equals("÷")) comando = "/";
            controller.processarComando(comando);
        });

        add(visor, BorderLayout.NORTH);
        add(painelBotoes, BorderLayout.CENTER);
    }

    public CalculadoraController getController() {
        return controller;
    }
}
