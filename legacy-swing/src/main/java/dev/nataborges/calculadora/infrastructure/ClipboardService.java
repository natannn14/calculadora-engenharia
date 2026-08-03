package dev.nataborges.calculadora.infrastructure;

import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.StringSelection;
import java.util.Optional;

public class ClipboardService {
    
    public void copiar(String texto) {
        StringSelection selection = new StringSelection(texto);
        Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
        clipboard.setContents(selection, selection);
    }
    
    public Optional<String> colar() {
        try {
            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
            if (clipboard.isDataFlavorAvailable(DataFlavor.stringFlavor)) {
                String texto = (String) clipboard.getData(DataFlavor.stringFlavor);
                return Optional.ofNullable(texto);
            }
        } catch (Exception e) {
        }
        return Optional.empty();
    }
}
