package dev.nataborges.calculadora.theme;

import java.awt.Color;
import java.awt.Font;

public class TemaSpiderManMiles implements Tema {
    @Override public Color getCorFundoPrincipal() { return new Color(15, 15, 15); }
    @Override public Color getCorFundoVisor() { return new Color(30, 30, 30); }
    @Override public Color getCorTextoVisor() { return new Color(255, 255, 255); }
    @Override public Color getCorHistorico() { return new Color(200, 50, 50); }
    
    @Override public Color getCorBotaoNumero() { return new Color(40, 40, 40); }
    @Override public Color getCorTextoBotaoNumero() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoOperador() { return new Color(220, 10, 10); }
    @Override public Color getCorTextoBotaoOperador() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoIgual() { return new Color(220, 10, 10); }
    @Override public Color getCorTextoBotaoIgual() { return new Color(255, 255, 255); }
    
    @Override public Color getCorBotaoClear() { return new Color(100, 100, 100); }
    @Override public Color getCorTextoBotaoClear() { return new Color(255, 255, 255); }
    
    @Override public Font getFonteVisor() { return new Font("Arial Black", Font.PLAIN, 48); }
    @Override public Font getFonteHistorico() { return new Font("Arial", Font.BOLD, 18); }
    @Override public Font getFonteBotao() { return new Font("Arial Black", Font.PLAIN, 24); }
}
