package dev.nataborges.calculadora.theme;

import javax.swing.SwingUtilities;
import java.awt.Component;
import java.awt.Container;
import java.util.ArrayList;
import java.util.List;

public class ThemeManager {
    private static ThemeManager instance;
    private Tema temaAtual;
    private final List<ThemeObserver> observadores = new ArrayList<>();

    private ThemeManager() {
        this.temaAtual = new TemaEscuro();
    }

    public static ThemeManager getInstance() {
        if (instance == null) {
            instance = new ThemeManager();
        }
        return instance;
    }

    public Tema getTemaAtual() {
        return temaAtual;
    }

    public void setTema(Tema novoTema, Component rootComponent) {
        this.temaAtual = novoTema;
        notificarObservadores();
        atualizarArvoreComponentes(rootComponent);
    }

    public void registrar(ThemeObserver observador) {
        observadores.add(observador);
    }

    public void remover(ThemeObserver observador) {
        observadores.remove(observador);
    }

    private void notificarObservadores() {
        for (ThemeObserver obs : observadores) {
            obs.onTemaAlterado(temaAtual);
        }
    }

    private void atualizarArvoreComponentes(Component root) {
        SwingUtilities.updateComponentTreeUI(root);
        
        if (root instanceof Container) {
            Container container = (Container) root;
            container.revalidate();
            container.repaint();
        }
    }
}
