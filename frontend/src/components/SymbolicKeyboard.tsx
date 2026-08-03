import type { SymbolicTask } from "../types";

type KeyType = "char" | "func" | "task";

interface Key {
  label: string;
  value: string;
  type: KeyType;
}

const KEYS: Key[] = [
  // Básicos
  { label: "x",     value: "x",     type: "char" },
  { label: "y",     value: "y",     type: "char" },
  { label: "(",     value: "(",     type: "char" },
  { label: ")",     value: ")",     type: "char" },
  { label: "+",     value: "+",     type: "char" },
  { label: "−",     value: "-",     type: "char" },
  { label: "×",     value: "*",     type: "char" },
  { label: "÷",     value: "/",     type: "char" },
  { label: "^",     value: "^",     type: "char" },
  // Funções
  { label: "sin",   value: "sin(",  type: "func" },
  { label: "cos",   value: "cos(",  type: "func" },
  { label: "tan",   value: "tan(",  type: "func" },
  { label: "ln",    value: "ln(",   type: "func" },
  { label: "log",   value: "log(",  type: "func" },
  { label: "√",     value: "sqrt(", type: "func" },
  { label: "eˣ",    value: "exp(",  type: "func" },
  // Tarefas rápidas
  { label: "d/dx",     value: "derive",    type: "task" },
  { label: "∫ dx",     value: "integrate", type: "task" },
  { label: "simplify", value: "simplify",  type: "task" },
  { label: "factor",   value: "factor",    type: "task" },
  { label: "expand",   value: "expand",    type: "task" },
  { label: "limit",    value: "limit",     type: "task" },
  { label: "taylor",   value: "taylor",    type: "task" },
];

interface SymbolicKeyboardProps {
  onInsert: (text: string, task?: SymbolicTask) => void;
}

const CLASS_MAP: Record<KeyType, string> = {
  char: "btn btn-num",
  func: "btn btn-func",
  task: "btn btn-task",
};

export function SymbolicKeyboard({ onInsert }: SymbolicKeyboardProps) {
  return (
    <div>
      <p
        className="field-label"
        style={{ marginBottom: "0.5rem" }}
      >
        Teclado rápido
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "6px",
        }}
      >
        {KEYS.map((k, i) => (
          <button
            key={i}
            type="button"
            title={k.type === "task" ? `Mudar tarefa: ${k.value}` : `Inserir: ${k.value}`}
            onClick={() =>
              k.type === "task"
                ? onInsert("", k.value as SymbolicTask)
                : onInsert(k.value)
            }
            className={CLASS_MAP[k.type]}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
