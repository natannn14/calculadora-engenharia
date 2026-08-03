import type { SymbolicTask } from "../types";

type KeyType = "char" | "func" | "task";

interface Key {
  label: string;
  value: string;
  type: KeyType;
  hiddenOnMobile?: boolean;
}

const KEYS: Key[] = [
  // Linha 1
  { label: "lim",    value: "limit",     type: "task" },
  { label: "d/dx",   value: "derive",    type: "task" },
  { label: "∫",      value: "integrate", type: "task" },
  { label: "simplify", value: "simplify", type: "task" },
  { label: "factor", value: "factor",    type: "task" },
  { label: "(",      value: "(",         type: "char", hiddenOnMobile: true },
  { label: ")",      value: ")",         type: "char", hiddenOnMobile: true },
  
  // Linha 2
  { label: "sen",    value: "sin(",      type: "func" },
  { label: "cos",    value: "cos(",      type: "func" },
  { label: "tg",     value: "tan(",      type: "func" },
  { label: "ln",     value: "ln(",       type: "func" },
  { label: "log",    value: "log(",      type: "func" },
  { label: "[",      value: "[",         type: "char", hiddenOnMobile: true },
  { label: "]",      value: "]",         type: "char", hiddenOnMobile: true },
  
  // Linha 3
  { label: "√",      value: "sqrt(",     type: "func" },
  { label: "x²",     value: "^2",        type: "char" },
  { label: "xⁿ",     value: "^",         type: "char" },
  { label: "π",      value: "pi",        type: "char" },
  { label: "e",      value: "E",         type: "char" },
  { label: "∞",      value: "Infinity",  type: "char", hiddenOnMobile: true },
  { label: "⌫",      value: "backspace", type: "char", hiddenOnMobile: true },
  
  // Mobile Extras
  { label: "(",      value: "(",         type: "char", hiddenOnMobile: false }, // Only visible on mobile in design, but we can simplify and just use generic flex/grid layout
];

// Simplified key array closer to the original AI design
const AI_KEYS = [
  // Row 1
  { label: "lim",  value: "limit",     class: "border-outline-variant text-secondary hover:border-secondary hover:bg-secondary/10" },
  { label: "d/dx", value: "derive",    class: "border-outline-variant text-secondary hover:border-secondary hover:bg-secondary/10" },
  { label: "∫",    value: "integrate", class: "border-outline-variant text-secondary hover:border-secondary hover:bg-secondary/10" },
  { label: "exp",  value: "expand",    class: "border-outline-variant text-secondary hover:border-secondary hover:bg-secondary/10" },
  { label: "fac",  value: "factor",    class: "border-outline-variant text-secondary hover:border-secondary hover:bg-secondary/10" },
  { label: "(",    value: "(",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10 hidden md:block" },
  { label: ")",    value: ")",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10 hidden md:block" },
  
  // Row 2
  { label: "sen",  value: "sin(",      class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10" },
  { label: "cos",  value: "cos(",      class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10" },
  { label: "tg",   value: "tan(",      class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10" },
  { label: "ln",   value: "ln(",       class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10" },
  { label: "log",  value: "log(",      class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10" },
  { label: "[",    value: "[",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10 hidden md:block" },
  { label: "]",    value: "]",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10 hidden md:block" },
  
  // Row 3
  { label: "√",    value: "sqrt(",     class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10" },
  { label: "x²",   value: "^2",        class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10" },
  { label: "xⁿ",   value: "^",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10" },
  { label: "π",    value: "pi",        class: "border-outline-variant text-secondary hover:border-secondary hover:bg-secondary/10" },
  { label: "e",    value: "E",         class: "border-outline-variant text-secondary hover:border-secondary hover:bg-secondary/10" },
  { label: "∞",    value: "Infinity",  class: "border-outline-variant text-secondary hover:border-secondary hover:bg-secondary/10 hidden md:block" },
  { label: "⌫",   value: "backspace", class: "border-outline-variant text-error hover:border-error hover:bg-error/10 hidden md:block" },
  
  // Mobile Extras (visible only on mobile)
  { label: "(",    value: "(",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10 md:hidden" },
  { label: ")",    value: ")",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10 md:hidden" },
  { label: "x",    value: "x",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10 md:hidden" },
  { label: "y",    value: "y",         class: "border-outline-variant text-on-surface hover:border-surface-tint hover:bg-surface-tint/10 md:hidden" },
  { label: "⌫",   value: "backspace", class: "border-outline-variant text-error hover:border-error hover:bg-error/10 md:hidden" },
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
    <div className="calc-panel bg-surface-container-low rounded-lg p-xs md:p-sm border border-outline-variant/50 relative overflow-hidden mt-auto">
      <div className="absolute top-0 right-0 p-xs bg-surface-container-high rounded-bl text-[10px] font-mono-code text-on-surface-variant uppercase tracking-widest border-b border-l border-outline-variant/50">
        ENG_KB_V1
      </div>
      
      <div className="grid grid-cols-5 md:grid-cols-7 gap-xs mt-md">
        {AI_KEYS.map((k, i) => (
          <button
            key={i}
            type="button"
            title={`Inserir: ${k.label}`}
            onClick={() => handleKeyClick(k)}
            className={`calc-btn bg-surface border font-mono-data text-mono-data min-h-[44px] py-md md:py-sm rounded transition-colors shadow-sm text-center col-span-1 ${k.class}`}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
