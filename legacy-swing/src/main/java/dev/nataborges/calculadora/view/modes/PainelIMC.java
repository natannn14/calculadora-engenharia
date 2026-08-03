package dev.nataborges.calculadora.view.modes;

import dev.nataborges.calculadora.theme.Tema;
import dev.nataborges.calculadora.theme.ThemeManager;
import dev.nataborges.calculadora.theme.ThemeObserver;

import javax.swing.*;
import java.awt.*;

public class PainelIMC extends JPanel implements ThemeObserver {

    private final JTextField txtPeso;
    private final JTextField txtAltura;
    private final JLabel lblResultado;

    public PainelIMC() {
        ThemeManager.getInstance().registrar(this);
        Tema tema = ThemeManager.getInstance().getTemaAtual();
        
        setLayout(new GridBagLayout());
        setBackground(tema.getCorFundoPrincipal());
        
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel lblPeso = new JLabel("Peso (kg):");
        lblPeso.setFont(tema.getFonteBotao());
        lblPeso.setForeground(tema.getCorTextoVisor());
        
        txtPeso = new JTextField(10);
        txtPeso.setFont(tema.getFonteVisor().deriveFont(32f));
        
        JLabel lblAltura = new JLabel("Altura (m):");
        lblAltura.setFont(tema.getFonteBotao());
        lblAltura.setForeground(tema.getCorTextoVisor());
        
        txtAltura = new JTextField(10);
        txtAltura.setFont(tema.getFonteVisor().deriveFont(32f));
        
        JButton btnCalcular = new JButton("Calcular IMC");
        btnCalcular.setFont(tema.getFonteBotao());
        btnCalcular.setBackground(tema.getCorBotaoIgual());
        btnCalcular.setForeground(tema.getCorTextoBotaoIgual());
        
        lblResultado = new JLabel("Resultado: ---");
        lblResultado.setFont(tema.getFonteVisor().deriveFont(36f));
        lblResultado.setForeground(tema.getCorTextoVisor());
        
        btnCalcular.addActionListener(e -> calcularIMC());

        gbc.gridx = 0; gbc.gridy = 0;
        add(lblPeso, gbc);
        gbc.gridx = 1;
        add(txtPeso, gbc);
        
        gbc.gridx = 0; gbc.gridy = 1;
        add(lblAltura, gbc);
        gbc.gridx = 1;
        add(txtAltura, gbc);
        
        gbc.gridx = 0; gbc.gridy = 2;
        gbc.gridwidth = 2;
        add(btnCalcular, gbc);
        
        gbc.gridy = 3;
        add(lblResultado, gbc);
    }

    private void calcularIMC() {
        try {
            double peso = Double.parseDouble(txtPeso.getText().replace(",", "."));
            double altura = Double.parseDouble(txtAltura.getText().replace(",", "."));
            double imc = peso / (altura * altura);
            lblResultado.setText(String.format("Resultado: %.2f", imc));
        } catch (NumberFormatException ex) {
            lblResultado.setText("Entrada inválida!");
        }
    }

    @Override
    public void onTemaAlterado(Tema novoTema) {
        setBackground(novoTema.getCorFundoPrincipal());
        
        Component[] components = getComponents();
        for (Component c : components) {
            if (c instanceof JLabel) {
                c.setForeground(novoTema.getCorTextoVisor());
                c.setFont(novoTema.getFonteBotao());
            } else if (c instanceof JButton) {
                c.setBackground(novoTema.getCorBotaoIgual());
                c.setForeground(novoTema.getCorTextoBotaoIgual());
                c.setFont(novoTema.getFonteBotao());
            } else if (c instanceof JTextField) {
                c.setFont(novoTema.getFonteVisor().deriveFont(32f));
            }
        }
        lblResultado.setFont(novoTema.getFonteVisor().deriveFont(36f));
    }
}
