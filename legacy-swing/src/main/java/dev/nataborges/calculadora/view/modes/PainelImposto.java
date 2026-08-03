package dev.nataborges.calculadora.view.modes;

import dev.nataborges.calculadora.theme.Tema;
import dev.nataborges.calculadora.theme.ThemeManager;
import dev.nataborges.calculadora.theme.ThemeObserver;

import javax.swing.*;
import java.awt.*;

public class PainelImposto extends JPanel implements ThemeObserver {

    private final JTextField txtSalario;
    private final JLabel lblImposto;
    private final JLabel lblLiquido;

    public PainelImposto() {
        ThemeManager.getInstance().registrar(this);
        Tema tema = ThemeManager.getInstance().getTemaAtual();
        
        setLayout(new GridBagLayout());
        setBackground(tema.getCorFundoPrincipal());
        
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel lblSalario = new JLabel("Salário Bruto (R$):");
        lblSalario.setFont(tema.getFonteBotao());
        lblSalario.setForeground(tema.getCorTextoVisor());
        
        txtSalario = new JTextField(10);
        txtSalario.setFont(tema.getFonteVisor().deriveFont(32f));
        
        JButton btnCalcular = new JButton("Calcular IRRF");
        btnCalcular.setFont(tema.getFonteBotao());
        btnCalcular.setBackground(tema.getCorBotaoIgual());
        btnCalcular.setForeground(tema.getCorTextoBotaoIgual());
        
        lblImposto = new JLabel("Imposto (IRRF): R$ 0,00");
        lblImposto.setFont(tema.getFonteVisor().deriveFont(28f));
        lblImposto.setForeground(tema.getCorTextoVisor());
        
        lblLiquido = new JLabel("Salário Líquido: R$ 0,00");
        lblLiquido.setFont(tema.getFonteVisor().deriveFont(28f));
        lblLiquido.setForeground(tema.getCorTextoVisor());
        
        btnCalcular.addActionListener(e -> calcularImposto());

        gbc.gridx = 0; gbc.gridy = 0;
        add(lblSalario, gbc);
        gbc.gridx = 1;
        add(txtSalario, gbc);
        
        gbc.gridx = 0; gbc.gridy = 1;
        gbc.gridwidth = 2;
        add(btnCalcular, gbc);
        
        gbc.gridy = 2;
        add(lblImposto, gbc);
        
        gbc.gridy = 3;
        add(lblLiquido, gbc);
    }

    private void calcularImposto() {
        try {
            double salario = Double.parseDouble(txtSalario.getText().replace(",", "."));
            double irrf = 0;
            
            // Tabela simplificada IRRF 2024
            if (salario <= 2259.20) {
                irrf = 0;
            } else if (salario <= 2826.65) {
                irrf = (salario * 0.075) - 169.44;
            } else if (salario <= 3751.05) {
                irrf = (salario * 0.15) - 381.44;
            } else if (salario <= 4664.68) {
                irrf = (salario * 0.225) - 662.77;
            } else {
                irrf = (salario * 0.275) - 896.00;
            }
            
            double liquido = salario - irrf;
            
            lblImposto.setText(String.format("Imposto (IRRF): R$ %.2f", irrf));
            lblLiquido.setText(String.format("Salário Líquido: R$ %.2f", liquido));
        } catch (NumberFormatException ex) {
            lblImposto.setText("Entrada inválida!");
            lblLiquido.setText("");
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
        lblImposto.setFont(novoTema.getFonteVisor().deriveFont(28f));
        lblLiquido.setFont(novoTema.getFonteVisor().deriveFont(28f));
    }
}
