package dev.nataborges.calculadora.theme;

import java.awt.Color;
import java.awt.Font;

public class TemaGoku implements Tema {
    @Override public Color getCorFundoPrincipal() { return new Color(255, 102, 0); }
    @Override public Color getCorFundoVisor() { return new Color(255, 248, 220); }
    @Override public Color getCorTextoVisor() { return new Color(0, 0, 0); }
    @Override public Color getCorHistorico() { return new Color(100, 50, 0); }
    
    @Override public Color getCorBotaoNumero() { return new Color(25, 25, 112); }
    @Override public Color getCorTextoBotaoNumero() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoOperador() { return new Color(255, 215, 0); }
    @Override public Color getCorTextoBotaoOperador() { return new Color(0, 0, 0); }
    
    @Override public Color getCorBotaoIgual() { return new Color(255, 215, 0); }
    @Override public Color getCorTextoBotaoIgual() { return new Color(0, 0, 0); }
    
    @Override public Color getCorBotaoClear() { return new Color(200, 30, 30); }
    @Override public Color getCorTextoBotaoClear() { return new Color(255, 255, 255); }
    
    @Override public Font getFonteVisor() { return new Font("Segoe UI", Font.BOLD, 48); }
    @Override public Font getFonteHistorico() { return new Font("Segoe UI", Font.PLAIN, 18); }
    @Override public Font getFonteBotao() { return new Font("Segoe UI", Font.BOLD, 24); }
}
