package dev.nataborges.calculadora.theme;

import java.awt.Color;
import java.awt.Font;

public class TemaBen10 implements Tema {
    @Override public Color getCorFundoPrincipal() { return new Color(50, 205, 50); }
    @Override public Color getCorFundoVisor() { return new Color(10, 10, 10); }
    @Override public Color getCorTextoVisor() { return new Color(152, 251, 152); }
    @Override public Color getCorHistorico() { return new Color(0, 100, 0); }
    
    @Override public Color getCorBotaoNumero() { return new Color(20, 20, 20); }
    @Override public Color getCorTextoBotaoNumero() { return new Color(152, 251, 152); }
    
    @Override public Color getCorBotaoOperador() { return new Color(60, 60, 60); }
    @Override public Color getCorTextoBotaoOperador() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoIgual() { return new Color(255, 255, 255); }
    @Override public Color getCorTextoBotaoIgual() { return new Color(50, 205, 50); }
    
    @Override public Color getCorBotaoClear() { return new Color(0, 100, 0); }
    @Override public Color getCorTextoBotaoClear() { return new Color(255, 255, 255); }
    
    @Override public Font getFonteVisor() { return new Font("Consolas", Font.BOLD, 48); }
    @Override public Font getFonteHistorico() { return new Font("Consolas", Font.PLAIN, 18); }
    @Override public Font getFonteBotao() { return new Font("Consolas", Font.BOLD, 24); }
}
