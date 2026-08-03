package dev.nataborges.calculadora.theme;

import java.awt.Color;
import java.awt.Font;

public class TemaClaro implements Tema {
    @Override public Color getCorFundoPrincipal() { return new Color(243, 243, 243); }
    @Override public Color getCorFundoVisor() { return new Color(230, 230, 230); }
    @Override public Color getCorTextoVisor() { return new Color(0, 0, 0); }
    @Override public Color getCorHistorico() { return new Color(100, 100, 100); }
    
    @Override public Color getCorBotaoNumero() { return new Color(245, 245, 245); }
    @Override public Color getCorTextoBotaoNumero() { return new Color(0, 0, 0); }
    
    @Override public Color getCorBotaoOperador() { return new Color(255, 140, 0); }
    @Override public Color getCorTextoBotaoOperador() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoIgual() { return new Color(34, 160, 34); }
    @Override public Color getCorTextoBotaoIgual() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoClear() { return new Color(220, 50, 50); }
    @Override public Color getCorTextoBotaoClear() { return new Color(255, 255, 255); }
    
    @Override public Font getFonteVisor() { return new Font("Segoe UI", Font.BOLD, 48); }
    @Override public Font getFonteHistorico() { return new Font("Segoe UI", Font.PLAIN, 18); }
    @Override public Font getFonteBotao() { return new Font("Segoe UI", Font.PLAIN, 24); }
}
