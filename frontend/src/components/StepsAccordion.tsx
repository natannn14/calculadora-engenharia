interface StepsAccordionProps {
  steps: string[];
}

export function StepsAccordion({ steps }: StepsAccordionProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="calc-panel bg-surface-container h-full rounded-lg flex flex-col shadow-xl overflow-hidden relative border-t border-surface-tint mt-lg">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full text-secondary" fill="none" preserveAspectRatio="none" stroke="currentColor" viewBox="0 0 100 100">
          <path d="M0 100 Q 25 50, 50 100 T 100 100" strokeDasharray="2,2" strokeWidth="0.5"></path>
          <path d="M0 20 L100 20 M0 40 L100 40 M0 60 L100 60 M0 80 L100 80" strokeWidth="0.2"></path>
        </svg>
      </div>

      <div className="p-sm md:p-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high/50 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary">memory</span>
          <h2 className="font-headline-md text-[16px] md:text-[18px] text-on-surface tracking-wide">Resolução Passo-a-Passo</h2>
        </div>
        <div className="flex items-center gap-xs">
          <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
          <span className="font-mono-code text-[10px] text-on-surface-variant uppercase tracking-widest hidden md:inline">SUCCESS</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-md space-y-lg relative z-10 custom-scrollbar">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const delay = (index * 0.2).toFixed(1) + "s";
          
          return (
            <div 
              key={index} 
              className="relative pl-lg opacity-0 animate-slideUp" 
              style={{ animationDelay: delay, animationFillMode: "forwards" }}
            >
              {/* Vertical line connecting steps */}
              {!isLast && (
                <div className="absolute left-0 top-0 bottom-[-24px] w-[1px] bg-secondary/30"></div>
              )}
              {isLast && (
                <div className="absolute left-0 top-0 h-4 w-[1px] bg-secondary/30"></div>
              )}
              
              {/* Dot */}
              <div className={`absolute left-[-3px] top-2 w-[7px] h-[7px] bg-surface border-2 border-secondary rounded-full ${isLast ? 'bg-secondary shadow-[0_0_8px_var(--tw-shadow-color)] shadow-secondary border-none left-[-4px] w-[9px] h-[9px]' : ''}`}></div>
              
              {/* Step Title */}
              <div className={`font-label-caps text-[10px] mb-xs tracking-wider ${isLast ? 'text-secondary' : 'text-on-surface-variant'}`}>
                {isLast ? "RESULTADO FINAL" : `PASSO ${index + 1}`}
              </div>
              
              {/* Content */}
              <div className={`rounded p-sm border-l-2 font-mono-data text-primary text-[14px] md:text-[15px] overflow-x-auto ${isLast ? 'bg-surface border border-secondary/50 p-sm md:p-md shadow-inner text-[15px] md:text-[18px]' : 'bg-surface/50 border-surface-tint/50'}`}>
                {/* O backend envia o passo como string. Vamos manter os quebras de linha */}
                {step.split('\n').map((line, i) => (
                  <div key={i} className="min-h-[1.5em]">{line}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
