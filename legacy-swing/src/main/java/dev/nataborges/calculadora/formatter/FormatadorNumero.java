package dev.nataborges.calculadora.formatter;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

public class FormatadorNumero {
    private final NumberFormat formatadorLocal;

    public FormatadorNumero() {
        this.formatadorLocal = NumberFormat.getNumberInstance(Locale.getDefault());
        this.formatadorLocal.setMaximumFractionDigits(10);
    }

    public double parse(String texto) throws ParseException {
        texto = texto.trim();
        char sep = java.text.DecimalFormatSymbols.getInstance().getDecimalSeparator();
        
        if (sep == ',') {
            texto = texto.replace(".", ",");
        } else if (sep == '.') {
            texto = texto.replace(",", ".");
        }
        
        return formatadorLocal.parse(texto).doubleValue();
    }

    public String formatar(double valor) {
        if (valor == (long) valor) {
            return String.format("%d", (long) valor);
        }
        return formatadorLocal.format(valor);
    }
}
