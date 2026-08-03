package dev.nataborges.calculadora.view;

import dev.nataborges.calculadora.config.Constantes;
import dev.nataborges.calculadora.controller.CalculadoraController;
import dev.nataborges.calculadora.model.CalculadoraEstado;
import dev.nataborges.calculadora.theme.Tema;
import dev.nataborges.calculadora.theme.ThemeManager;
import dev.nataborges.calculadora.theme.ThemeObserver;
import dev.nataborges.calculadora.view.modes.ModoBasicoPanel;
import dev.nataborges.calculadora.view.modes.PainelIMC;
import dev.nataborges.calculadora.view.modes.PainelImposto;
import dev.nataborges.calculadora.view.modes.PainelCalculo;

import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.KeyEventDispatcher;
import java.awt.KeyboardFocusManager;

public class CalculadoraFrame extends JFrame implements ThemeObserver {
    
    private final CalculadoraController controller;
    private final JPanel containerModos;
    private final CardLayout cardLayout;
    private String modoAtual = "BASICO";

    public CalculadoraFrame() {
        this(CalculadoraEstado.estadoInicial());
    }

    public CalculadoraFrame(CalculadoraEstado estadoInicial) {
        ThemeManager.getInstance().registrar(this);
        Tema tema = ThemeManager.getInstance().getTemaAtual();
        
        setTitle("Calculadora");
        setSize(Constantes.LARGURA, Constantes.ALTURA + 80);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        
        cardLayout = new CardLayout();
        containerModos = new JPanel(cardLayout);
        
        ModoBasicoPanel modoBasico = new ModoBasicoPanel(estadoInicial);
        this.controller = modoBasico.getController();
        
        containerModos.add(modoBasico, "BASICO");
        containerModos.add(new PainelIMC(), "IMC");
        containerModos.add(new PainelImposto(), "IMPOSTO");
        containerModos.add(new PainelCalculo(), "CALCULO");
        
        setContentPane(containerModos);
        
        configurarMenu();
        configurarTeclado();
    }

    @Override
    public void onTemaAlterado(Tema novoTema) {
        // O fundo do container principal não precisa ser mudado se os sub-paineis já se cuidam,
        // mas por precaução:
        containerModos.setBackground(novoTema.getCorFundoPrincipal());
    }

    private void configurarMenu() {
        JMenuBar menuBar = new JMenuBar();
        
        // Menu de Modos
        JMenu menuModo = new JMenu("Modo");
        ButtonGroup groupModo = new ButtonGroup();
        adicionarModoMenu(menuModo, groupModo, "Básico", "BASICO", true);
        adicionarModoMenu(menuModo, groupModo, "Cálculo Avançado", "CALCULO", false);
        adicionarModoMenu(menuModo, groupModo, "IMC", "IMC", false);
        adicionarModoMenu(menuModo, groupModo, "Imposto", "IMPOSTO", false);
        menuBar.add(menuModo);
        
        // Menu de Temas
        JMenu menuOpcoes = new JMenu("Temas");
        ButtonGroup groupTemas = new ButtonGroup();
        adicionarTemaMenu(menuOpcoes, groupTemas, "Claro", new dev.nataborges.calculadora.theme.TemaClaro(), false);
        adicionarTemaMenu(menuOpcoes, groupTemas, "Escuro", new dev.nataborges.calculadora.theme.TemaEscuro(), true);
        adicionarTemaMenu(menuOpcoes, groupTemas, "Naruto", new dev.nataborges.calculadora.theme.TemaNaruto(), false);
        adicionarTemaMenu(menuOpcoes, groupTemas, "Goku", new dev.nataborges.calculadora.theme.TemaGoku(), false);
        adicionarTemaMenu(menuOpcoes, groupTemas, "Spider-Man (Peter)", new dev.nataborges.calculadora.theme.TemaSpiderManPeter(), false);
        adicionarTemaMenu(menuOpcoes, groupTemas, "Spider-Man (Miles)", new dev.nataborges.calculadora.theme.TemaSpiderManMiles(), false);
        adicionarTemaMenu(menuOpcoes, groupTemas, "Ben 10", new dev.nataborges.calculadora.theme.TemaBen10(), false);
        menuBar.add(menuOpcoes);
        
        setJMenuBar(menuBar);
    }
    
    private void adicionarModoMenu(JMenu menu, ButtonGroup group, String nome, String id, boolean selecionado) {
        JRadioButtonMenuItem item = new JRadioButtonMenuItem(nome, selecionado);
        item.addActionListener(e -> {
            cardLayout.show(containerModos, id);
            modoAtual = id;
        });
        group.add(item);
        menu.add(item);
    }

    private void adicionarTemaMenu(JMenu menu, ButtonGroup group, String nome, Tema tema, boolean selecionado) {
        JRadioButtonMenuItem item = new JRadioButtonMenuItem(nome, selecionado);
        item.addActionListener(e -> ThemeManager.getInstance().setTema(tema, this));
        group.add(item);
        menu.add(item);
    }

    private void configurarTeclado() {
        KeyboardFocusManager.getCurrentKeyboardFocusManager().addKeyEventDispatcher(new KeyEventDispatcher() {
            @Override
            public boolean dispatchKeyEvent(KeyEvent e) {
                if (!isFocused() || !modoAtual.equals("BASICO")) return false;

                if (e.getID() == KeyEvent.KEY_TYPED) {
                    char c = e.getKeyChar();
                    if ((c >= '0' && c <= '9') || c == '+' || c == '-' || c == '*' || c == '/' || c == '=') {
                        controller.processarComando(String.valueOf(c));
                        return true;
                    } else if (c == 'c' || c == 'C') {
                        if (!e.isControlDown()) {
                            controller.processarComando("C");
                            return true;
                        }
                    } else if (c == ',' || c == '.') {
                        controller.processarComando(",");
                        return true;
                    }
                } else if (e.getID() == KeyEvent.KEY_PRESSED) {
                    if (e.isControlDown() && e.getKeyCode() == KeyEvent.VK_C) {
                        controller.processarComando("Copy");
                        return true;
                    } else if (e.isControlDown() && e.getKeyCode() == KeyEvent.VK_V) {
                        controller.processarComando("Paste");
                        return true;
                    } else if (e.getKeyCode() == KeyEvent.VK_BACK_SPACE) {
                        controller.processarComando("Backspace");
                        return true;
                    } else if (e.getKeyCode() == KeyEvent.VK_ESCAPE || e.getKeyCode() == KeyEvent.VK_DELETE) {
                        controller.processarComando("C");
                        return true;
                    } else if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        controller.processarComando("Enter");
                        return true;
                    }
                }
                return false;
            }
        });
    }
}
