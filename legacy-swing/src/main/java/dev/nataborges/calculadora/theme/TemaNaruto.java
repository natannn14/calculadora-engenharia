package dev.nataborges.calculadora.theme;

import java.awt.Color;
import java.awt.Font;

public class TemaNaruto implements Tema {
    @Override public Color getCorFundoPrincipal() { return new Color(255, 140, 0); }
    @Override public Color getCorFundoVisor() { return new Color(255, 235, 205); }
    @Override public Color getCorTextoVisor() { return new Color(0, 0, 0); }
    @Override public Color getCorHistorico() { return new Color(100, 50, 0); }
    
    @Override public Color getCorBotaoNumero() { return new Color(255, 255, 255); }
    @Override public Color getCorTextoBotaoNumero() { return new Color(0, 0, 0); }
    
    @Override public Color getCorBotaoOperador() { return new Color(0, 0, 139); }
    @Override public Color getCorTextoBotaoOperador() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoIgual() { return new Color(20, 20, 20); }
    @Override public Color getCorTextoBotaoIgual() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoClear() { return new Color(200, 0, 0); }
    @Override public Color getCorTextoBotaoClear() { return new Color(255, 255, 255); }
    
    @Override public Font getFonteVisor() { return new Font("Segoe UI", Font.BOLD, 48); }
    @Override public Font getFonteHistorico() { return new Font("Segoe UI", Font.PLAIN, 18); }
    @Override public Font getFonteBotao() { return new Font("Segoe UI", Font.BOLD, 24); }
}
