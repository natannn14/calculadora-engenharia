package dev.nataborges.calculadora.view;

import dev.nataborges.calculadora.config.Constantes;
import dev.nataborges.calculadora.theme.Tema;
import dev.nataborges.calculadora.theme.ThemeManager;
import dev.nataborges.calculadora.theme.ThemeObserver;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;

public class PainelBotoes extends JPanel implements ThemeObserver {

    private final List<BotaoCalculadora> botoesRegistrados = new ArrayList<>();

    public PainelBotoes(ActionListener listener) {
        ThemeManager.getInstance().registrar(this);
        Tema tema = ThemeManager.getInstance().getTemaAtual();
        
        setLayout(new GridBagLayout());
        setBackground(tema.getCorFundoPrincipal());
        int padding = Constantes.GAP_BOTOES / 2;
        setBorder(new EmptyBorder(padding, padding, padding, padding));

        String[][] botoesTexto = {
            {"MC", "MR", "M+", "M-"},
            {"C", "±", "%", "÷"},
            {"7", "8", "9", "×"},
            {"4", "5", "6", "-"},
            {"1", "2", "3", "+"},
            {"0", ",", "="}
        };

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(padding, padding, padding, padding);
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;

        for (int linha = 0; linha < botoesTexto.length; linha++) {
            for (int col = 0; col < botoesTexto[linha].length; col++) {
                String texto = botoesTexto[linha][col];
                BotaoCalculadora botao = criarBotao(texto, tema);
                botao.addActionListener(listener);
                botoesRegistrados.add(botao);

                gbc.gridy = linha;
                if (texto.equals("0")) {
                    gbc.gridx = 0;
                    gbc.gridwidth = 2;
                } else if (linha == 5 && texto.equals(",")) {
                    gbc.gridx = 2;
                    gbc.gridwidth = 1;
                } else if (linha == 5 && texto.equals("=")) {
                    gbc.gridx = 3;
                    gbc.gridwidth = 1;
                } else {
                    gbc.gridx = col;
                    gbc.gridwidth = 1;
                }
                
                add(botao, gbc);
            }
        }
    }

    @Override
    public void onTemaAlterado(Tema novoTema) {
        setBackground(novoTema.getCorFundoPrincipal());
        for (BotaoCalculadora botao : botoesRegistrados) {
            atualizarCoresBotao(botao, novoTema);
        }
    }

    private BotaoCalculadora criarBotao(String texto, Tema tema) {
        BotaoCalculadora btn = new BotaoCalculadora(texto, Color.BLACK, Color.WHITE, tema);
        atualizarCoresBotao(btn, tema);
        return btn;
    }

    private void atualizarCoresBotao(BotaoCalculadora botao, Tema tema) {
        String texto = botao.getText();
        Color corFundo = tema.getCorBotaoNumero();
        Color corTexto = tema.getCorTextoBotaoNumero();

        if (texto.matches("[+\\-×÷=]")) {
            corFundo = tema.getCorBotaoOperador();
            corTexto = tema.getCorTextoBotaoOperador();
            if (texto.equals("=")) {
                corFundo = tema.getCorBotaoIgual();
                corTexto = tema.getCorTextoBotaoIgual();
            }
        } else if (texto.equals("C") || texto.equals("±") || texto.equals("%") || texto.startsWith("M")) {
            corFundo = tema.getCorBotaoClear();
            corTexto = tema.getCorTextoBotaoClear();
        }

        botao.aplicarCores(corFundo, corTexto, tema);
    }
}
