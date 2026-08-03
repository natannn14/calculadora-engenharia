package dev.nataborges.calculadora.view.modes;

import dev.nataborges.calculadora.theme.Tema;
import dev.nataborges.calculadora.theme.ThemeManager;
import dev.nataborges.calculadora.theme.ThemeObserver;

import org.matheclipse.core.eval.ExprEvaluator;
import org.matheclipse.core.interfaces.IExpr;

import javax.swing.*;
import java.awt.*;

public class PainelCalculo extends JPanel implements ThemeObserver {

    private final JTextField txtExpressao;
    private final JTextArea txtResultado;
    private final ExprEvaluator evaluator;

    public PainelCalculo() {
        ThemeManager.getInstance().registrar(this);
        Tema tema = ThemeManager.getInstance().getTemaAtual();
        
        evaluator = new ExprEvaluator();
        
        setLayout(new BorderLayout(10, 10));
        setBackground(tema.getCorFundoPrincipal());
        
        JPanel inputPanel = new JPanel(new BorderLayout(5, 5));
        inputPanel.setBackground(tema.getCorFundoPrincipal());
        inputPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JLabel lblDica = new JLabel("Ex: Integrate(x^2, x) ou D(sin(x), x)");
        lblDica.setFont(tema.getFonteHistorico());
        lblDica.setForeground(tema.getCorTextoVisor());
        
        txtExpressao = new JTextField();
        txtExpressao.setFont(new Font("Monospaced", Font.PLAIN, 24));
        
        JButton btnCalcular = new JButton("Calcular (=)");
        btnCalcular.setFont(tema.getFonteBotao());
        btnCalcular.setBackground(tema.getCorBotaoIgual());
        btnCalcular.setForeground(tema.getCorTextoBotaoIgual());
        
        inputPanel.add(lblDica, BorderLayout.NORTH);
        inputPanel.add(txtExpressao, BorderLayout.CENTER);
        inputPanel.add(btnCalcular, BorderLayout.EAST);
        
        txtResultado = new JTextArea();
        txtResultado.setFont(new Font("Monospaced", Font.BOLD, 28));
        txtResultado.setEditable(false);
        txtResultado.setLineWrap(true);
        txtResultado.setWrapStyleWord(true);
        txtResultado.setBackground(tema.getCorFundoVisor());
        txtResultado.setForeground(tema.getCorTextoVisor());
        
        JScrollPane scrollPane = new JScrollPane(txtResultado);
        scrollPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        scrollPane.setBackground(tema.getCorFundoPrincipal());
        
        add(inputPanel, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);
        
        btnCalcular.addActionListener(e -> calcularSymja());
        txtExpressao.addActionListener(e -> calcularSymja());
    }

    private void calcularSymja() {
        String expr = txtExpressao.getText().trim();
        if (expr.isEmpty()) return;
        
        try {
            IExpr result = evaluator.eval(expr);
            txtResultado.setText(result.toString());
        } catch (Exception ex) {
            txtResultado.setText("Erro de sintaxe ou de cálculo:\n" + ex.getMessage());
        }
    }

    @Override
    public void onTemaAlterado(Tema novoTema) {
        setBackground(novoTema.getCorFundoPrincipal());
        
        Component[] components = getComponents();
        for (Component c : components) {
            if (c instanceof JPanel) {
                c.setBackground(novoTema.getCorFundoPrincipal());
                for (Component ic : ((JPanel)c).getComponents()) {
                    if (ic instanceof JLabel) {
                        ic.setForeground(novoTema.getCorTextoVisor());
                        ic.setFont(novoTema.getFonteHistorico());
                    } else if (ic instanceof JButton) {
                        ic.setBackground(novoTema.getCorBotaoIgual());
                        ic.setForeground(novoTema.getCorTextoBotaoIgual());
                        ic.setFont(novoTema.getFonteBotao());
                    }
                }
            } else if (c instanceof JScrollPane) {
                c.setBackground(novoTema.getCorFundoPrincipal());
            }
        }
        
        txtResultado.setBackground(novoTema.getCorFundoVisor());
        txtResultado.setForeground(novoTema.getCorTextoVisor());
    }
}
