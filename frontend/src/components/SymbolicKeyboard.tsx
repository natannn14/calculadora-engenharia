import type { SymbolicTask } from "../types";


// Simplified key array closer to the original AI design
const AI_KEYS = [
  // Row 1
  { label: "lim",  value: "limit",     class: "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)]" },
  { label: "d/dx", value: "derive",    class: "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)]" },
  { label: "∫",    value: "integrate", class: "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)]" },
  { label: "exp",  value: "expand",    class: "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)]" },
  { label: "fac",  value: "factor",    class: "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)]" },
  { label: "(",    value: "(",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10 hidden md:block" },
  { label: ")",    value: ")",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10 hidden md:block" },
  
  // Row 2
  { label: "sen",  value: "sin(",      class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10" },
  { label: "cos",  value: "cos(",      class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10" },
  { label: "tg",   value: "tan(",      class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10" },
  { label: "ln",   value: "ln(",       class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10" },
  { label: "log",  value: "log(",      class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10" },
  { label: "[",    value: "[",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10 hidden md:block" },
  { label: "]",    value: "]",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10 hidden md:block" },
  
  // Row 3
  { label: "√",    value: "sqrt(",     class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10" },
  { label: "x²",   value: "^2",        class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10" },
  { label: "xⁿ",   value: "^",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10" },
  { label: "π",    value: "pi",        class: "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)]" },
  { label: "e",    value: "E",         class: "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)]" },
  { label: "∞",    value: "Infinity",  class: "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] hidden md:block" },
  { label: "⌫",   value: "backspace", class: "border-[var(--color-border)] text-red-500 hover:border-red-500 hover:bg-red-500/10 hidden md:block" },
  
  // Mobile Extras (visible only on mobile)
  { label: "(",    value: "(",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10 md:hidden" },
  { label: ")",    value: ")",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10 md:hidden" },
  { label: "x",    value: "x",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10 md:hidden" },
  { label: "y",    value: "y",         class: "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg)]-tint/10 md:hidden" },
  { label: "⌫",   value: "backspace", class: "border-[var(--color-border)] text-red-500 hover:border-red-500 hover:bg-red-500/10 md:hidden" },
];

interface SymbolicKeyboardProps {
  onInsert: (text: string, task?: SymbolicTask) => void;
  onBackspace?: () => void;
}

export function SymbolicKeyboard({ onInsert, onBackspace }: SymbolicKeyboardProps) {
  
  const handleKeyClick = (keyInfo: typeof AI_KEYS[0]) => {
    if (keyInfo.value === "backspace") {
      onBackspace?.();
      return;
    }
    
    // Check if it's a task
    const taskValues = ["derive", "integrate", "simplify", "factor", "expand", "limit", "taylor"];
    if (taskValues.includes(keyInfo.value)) {
      onInsert("", keyInfo.value as SymbolicTask);
    } else {
      onInsert(keyInfo.value);
    }
  };

  return (
    <div className="calc-panel premium-panel-low rounded-lg p-xs md:p-sm border border-[var(--color-border)]/50 relative overflow-hidden mt-auto">
      <div className="absolute top-0 right-0 p-xs premium-panel-high rounded-bl text-[10px] font-mono-code text-[var(--color-text)] opacity-70 uppercase tracking-widest border-b border-l border-[var(--color-border)]/50">
        ENG_KB_V1
      </div>
      
      <div className="grid grid-cols-5 md:grid-cols-7 gap-xs mt-md">
        {AI_KEYS.map((k, i) => (
          <button
            key={i}
            type="button"
            title={`Inserir: ${k.label}`}
            onClick={() => handleKeyClick(k)}
            className={`calc-btn bg-[var(--color-bg)] border font-mono-data text-mono-data min-h-[44px] py-md md:py-sm rounded transition-colors shadow-sm text-center col-span-1 ${k.class}`}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
