package dev.nataborges.calculadora.theme;

import java.awt.Color;
import java.awt.Font;

public interface Tema {
    Color getCorFundoPrincipal();
    Color getCorFundoVisor();
    Color getCorTextoVisor();
    Color getCorHistorico();
    
    Color getCorBotaoNumero();
    Color getCorTextoBotaoNumero();
    
    Color getCorBotaoOperador();
    Color getCorTextoBotaoOperador();
    
    Color getCorBotaoIgual();
    Color getCorTextoBotaoIgual();
    
    Color getCorBotaoClear();
    Color getCorTextoBotaoClear();
    
    Font getFonteVisor();
    Font getFonteHistorico();
    Font getFonteBotao();
}
