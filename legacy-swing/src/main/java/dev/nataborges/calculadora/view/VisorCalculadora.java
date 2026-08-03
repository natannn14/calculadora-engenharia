package dev.nataborges.calculadora.view;

import dev.nataborges.calculadora.config.Constantes;
import dev.nataborges.calculadora.theme.Tema;
import dev.nataborges.calculadora.theme.ThemeManager;
import dev.nataborges.calculadora.theme.ThemeObserver;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.geom.AffineTransform;

public class VisorCalculadora extends JPanel implements ThemeObserver, ActionListener {
    
    private Tema temaAtual;
    private String textoHistorico = "";
    private String textoValor = "0";

    private Timer animTimer;
    private double textScale = 1.0;
    private boolean scalingUp = false;
    
    private int shakeAmount = 0;
    private double currentShakeX = 0;

    private static final Color SHADOW_COLOR = new Color(0, 0, 0, 20);
    private static final Color GLOW_COLOR = new Color(255, 255, 255, 10);
    private static final BasicStroke GLOW_STROKE = new BasicStroke(1.5f);

    public VisorCalculadora() {
        this.temaAtual = ThemeManager.getInstance().getTemaAtual();
        ThemeManager.getInstance().registrar(this);
        
        setPreferredSize(new Dimension(Constantes.LARGURA, 140));
        setOpaque(false);
        
        animTimer = new Timer(16, this);
    }

    @Override
    public void onTemaAlterado(Tema novoTema) {
        this.temaAtual = novoTema;
        repaint();
    }

    public void setTextoVisorAtual(String texto) {
        if (!this.textoValor.equals(texto)) {
            this.textoValor = texto;
            
            if (Constantes.ANIMACOES_LIGADAS) {
                if (texto.equals("Divisão por zero") || texto.contains("Erro")) {
                    triggerErro();
                } else {
                    textScale = 1.0;
                    scalingUp = true;
                    animTimer.start();
                }
            }
        }
        repaint();
    }

    public void setHistorico(String texto) {
        this.textoHistorico = texto;
        repaint();
    }

    private void triggerErro() {
        if (Constantes.ANIMACOES_LIGADAS) {
            shakeAmount = 15;
            animTimer.start();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        boolean animating = false;

        if (scalingUp) {
            textScale += 0.015;
            if (textScale >= 1.03) {
                textScale = 1.03;
                scalingUp = false;
            }
            animating = true;
        } else if (textScale > 1.0) {
            textScale -= 0.015;
            if (textScale <= 1.0) {
                textScale = 1.0;
            }
            animating = true;
        }

        if (shakeAmount > 0) {
            currentShakeX = Math.sin(shakeAmount) * (shakeAmount / 2.0);
            shakeAmount--;
            animating = true;
        } else {
            currentShakeX = 0;
        }

        repaint();
        if (!animating) {
            animTimer.stop();
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_FRACTIONALMETRICS, RenderingHints.VALUE_FRACTIONALMETRICS_ON);
        g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);
        g2.setRenderingHint(RenderingHints.KEY_ALPHA_INTERPOLATION, RenderingHints.VALUE_ALPHA_INTERPOLATION_QUALITY);

        int width = getWidth();
        int height = getHeight();

        g2.setColor(temaAtual.getCorFundoPrincipal());
        g2.fillRect(0, 0, width, height);

        int padX = 15;
        int padY = 15;
        int vWidth = width - (padX * 2);
        int vHeight = height - (padY * 2);
        int corner = Constantes.BORDA_ARREDONDADA + 10;
        
        g2.setColor(SHADOW_COLOR);
        g2.fillRoundRect((int)(padX + currentShakeX), padY + 4, vWidth, vHeight, corner, corner);

        g2.setColor(temaAtual.getCorFundoVisor());
        g2.fillRoundRect((int)(padX + currentShakeX), padY, vWidth, vHeight, corner, corner);
        
        g2.setStroke(GLOW_STROKE);
        g2.setColor(GLOW_COLOR);
        g2.drawRoundRect((int)(padX + currentShakeX), padY, vWidth, vHeight - 2, corner, corner);

        int textRightMargin = padX + 20;

        g2.setFont(temaAtual.getFonteHistorico());
        g2.setColor(temaAtual.getCorHistorico());
        FontMetrics fmHist = g2.getFontMetrics();
        int histY = padY + fmHist.getAscent() + 10;
        int histX = width - textRightMargin - fmHist.stringWidth(textoHistorico);
        g2.drawString(textoHistorico, (int)(histX + currentShakeX), histY);

        g2.setFont(temaAtual.getFonteVisor());
        g2.setColor(temaAtual.getCorTextoVisor());
        FontMetrics fmValor = g2.getFontMetrics();
        int valorY = padY + vHeight - fmValor.getDescent() - 10;
        int valorX = width - textRightMargin - fmValor.stringWidth(textoValor);

        AffineTransform oldTx = g2.getTransform();
        int pivotX = width - textRightMargin;
        int pivotY = valorY;
        g2.translate(pivotX + currentShakeX, pivotY);
        g2.scale(textScale, textScale);
        g2.translate(-pivotX, -pivotY);

        g2.drawString(textoValor, valorX, valorY);
        
        g2.setTransform(oldTx);
        g2.dispose();
    }
}
