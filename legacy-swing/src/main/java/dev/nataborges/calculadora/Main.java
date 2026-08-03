package dev.nataborges.calculadora;

import dev.nataborges.calculadora.view.CalculadoraFrame;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;

public class Main {
    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        SwingUtilities.invokeLater(() -> {
            CalculadoraFrame frame = new CalculadoraFrame();
            frame.setVisible(true);
        });
    }
}
