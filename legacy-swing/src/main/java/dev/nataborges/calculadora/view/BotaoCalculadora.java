package dev.nataborges.calculadora.view;

import dev.nataborges.calculadora.config.Constantes;
import dev.nataborges.calculadora.theme.Tema;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.AffineTransform;

public class BotaoCalculadora extends JButton implements ActionListener {
    
    private Color corFundo;
    private Color corTexto;
    private Color corFundoHover;
    private Tema tema;

    private double escalaAtual = 1.0;
    private double escalaAlvo = 1.0;
    
    private double hoverBlend = 0.0;
    private double hoverBlendAlvo = 0.0;
    
    private double shadowOffset = 3.0;
    private double shadowOffsetAlvo = 3.0;

    private Timer animTimer;

    private static final Color SHADOW_COLOR = new Color(0, 0, 0, 40);

    public BotaoCalculadora(String texto, Color corFundo, Color corTexto, Tema tema) {
        super(texto);
        this.tema = tema;
        this.corFundo = corFundo;
        this.corTexto = corTexto;
        
        this.corFundoHover = new Color(
            Math.min(255, corFundo.getRed() + 25),
            Math.min(255, corFundo.getGreen() + 25),
            Math.min(255, corFundo.getBlue() + 25)
        );

        setContentAreaFilled(false);
        setFocusPainted(false);
        setFocusable(false);
        setBorderPainted(false);
        setOpaque(false);
        setCursor(new Cursor(Cursor.HAND_CURSOR));
        
        aplicarCores(corFundo, corTexto, tema);

        animTimer = new Timer(16, this);

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                if (Constantes.ANIMACOES_LIGADAS) {
                    hoverBlendAlvo = 1.0;
                    shadowOffsetAlvo = 6.0;
                    animTimer.start();
                } else {
                    hoverBlend = 1.0;
                    repaint();
                }
            }

            @Override
            public void mouseExited(MouseEvent e) {
                if (Constantes.ANIMACOES_LIGADAS) {
                    hoverBlendAlvo = 0.0;
                    escalaAlvo = 1.0;
                    shadowOffsetAlvo = 3.0;
                    animTimer.start();
                } else {
                    hoverBlend = 0.0;
                    escalaAtual = 1.0;
                    repaint();
                }
            }

            @Override
            public void mousePressed(MouseEvent e) {
                if (Constantes.ANIMACOES_LIGADAS) {
                    escalaAlvo = 0.95;
                    shadowOffsetAlvo = 1.0;
                    animTimer.start();
                }
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                if (Constantes.ANIMACOES_LIGADAS) {
                    escalaAlvo = 1.0;
                    shadowOffsetAlvo = getBounds().contains(e.getPoint()) ? 6.0 : 3.0; 
                    animTimer.start();
                }
            }
        });
    }

    public void aplicarCores(Color novaCorFundo, Color novaCorTexto, Tema novoTema) {
        this.tema = novoTema;
        this.corFundo = novaCorFundo;
        this.corTexto = novaCorTexto;
        
        this.corFundoHover = new Color(
            Math.min(255, corFundo.getRed() + 25),
            Math.min(255, corFundo.getGreen() + 25),
            Math.min(255, corFundo.getBlue() + 25)
        );

        setFont(tema.getFonteBotao());
        setForeground(corTexto);
        repaint();
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        boolean animating = false;
        
        if (Math.abs(hoverBlend - hoverBlendAlvo) > 0.01) {
            hoverBlend += (hoverBlendAlvo - hoverBlend) * 0.3;
            animating = true;
        } else {
            hoverBlend = hoverBlendAlvo;
        }
        
        if (Math.abs(escalaAtual - escalaAlvo) > 0.005) {
            escalaAtual += (escalaAlvo - escalaAtual) * 0.4;
            animating = true;
        } else {
            escalaAtual = escalaAlvo;
        }
        
        if (Math.abs(shadowOffset - shadowOffsetAlvo) > 0.1) {
            shadowOffset += (shadowOffsetAlvo - shadowOffset) * 0.3;
            animating = true;
        } else {
            shadowOffset = shadowOffsetAlvo;
        }

        repaint();
        if (!animating) {
            animTimer.stop();
        }
    }

    private Color blendColors(Color c1, Color c2, double ratio) {
        int r = (int) (c1.getRed() * (1 - ratio) + c2.getRed() * ratio);
        int g = (int) (c1.getGreen() * (1 - ratio) + c2.getGreen() * ratio);
        int b = (int) (c1.getBlue() * (1 - ratio) + c2.getBlue() * ratio);
        return new Color(r, g, b);
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_FRACTIONALMETRICS, RenderingHints.VALUE_FRACTIONALMETRICS_ON);
        g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2.setRenderingHint(RenderingHints.KEY_COLOR_RENDERING, RenderingHints.VALUE_COLOR_RENDER_QUALITY);

        int width = getWidth();
        int height = getHeight();
        
        int padding = 8; 
        
        int w = width - padding * 2;
        int h = height - padding * 2;
        int x = padding;
        int y = padding;

        Color corAtual = blendColors(corFundo, corFundoHover, hoverBlend);

        AffineTransform oldTx = g2.getTransform();
        double pivotX = width / 2.0;
        double pivotY = height / 2.0;
        g2.translate(pivotX, pivotY);
        g2.scale(escalaAtual, escalaAtual);
        g2.translate(-pivotX, -pivotY);

        int sOff = (int) shadowOffset;
        g2.setColor(SHADOW_COLOR);
        g2.fillRoundRect(x, y + sOff, w, h, Constantes.BORDA_ARREDONDADA, Constantes.BORDA_ARREDONDADA);
        
        if (hoverBlend > 0) {
            g2.setColor(new Color(corAtual.getRed(), corAtual.getGreen(), corAtual.getBlue(), (int)(60 * hoverBlend)));
            g2.fillRoundRect(x - 2, y - 2, w + 4, h + 4, Constantes.BORDA_ARREDONDADA + 2, Constantes.BORDA_ARREDONDADA + 2);
        }

        g2.setColor(corAtual);
        g2.fillRoundRect(x, y, w, h, Constantes.BORDA_ARREDONDADA, Constantes.BORDA_ARREDONDADA);

        FontMetrics fm = g2.getFontMetrics();
        int textX = (width - fm.stringWidth(getText())) / 2;
        int textY = (height - fm.getHeight()) / 2 + fm.getAscent();
        
        g2.setColor(getForeground());
        g2.drawString(getText(), textX, textY);
        
        g2.setTransform(oldTx);
        g2.dispose();
    }
}
