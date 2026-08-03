import { useState } from "react";

interface StepsAccordionProps {
  steps: string[];
}

export function StepsAccordion({ steps }: StepsAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!steps || steps.length === 0) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      <p className="field-label" style={{ marginBottom: "0.6rem" }}>
        Passos resolvidos
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-input)",
              border: `1px solid ${openIndex === i ? "var(--col-operator)" : "var(--border)"}`,
              borderRadius: "8px",
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            <button
              type="button"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.65rem 0.9rem",
                background: "transparent",
                border: "none",
                color: openIndex === i ? "var(--col-operator)" : "var(--text-primary)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "color 0.2s",
              }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>Passo {i + 1}</span>
              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                {openIndex === i ? "▲" : "▼"}
              </span>
            </button>
            {openIndex === i && (
              <div
                style={{
                  padding: "0.5rem 0.9rem 0.75rem",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  whiteSpace: "pre-wrap",
                  fontFamily: "'Segoe UI', 'Courier New', monospace",
                  lineHeight: 1.6,
                  borderTop: "1px solid var(--border)",
                }}
              >
                {s}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
