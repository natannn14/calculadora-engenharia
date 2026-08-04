const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Natã/.gemini/antigravity/scratch/calculadora-basica/frontend/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  // Surface
  ['text-on-surface-variant', 'text-[var(--color-pcb-silkscreen)] opacity-70'],
  ['text-on-surface', 'text-[var(--color-pcb-silkscreen)]'],
  ['bg-surface-variant', 'bg-[color-mix(in_srgb,var(--color-pcb-solder-mask)_90%,black)]'],
  ['bg-surface-container-high', 'bg-[color-mix(in_srgb,var(--color-pcb-solder-mask)_90%,black)]'],
  ['bg-surface-container-low', 'pcb-display'],
  ['bg-surface-container', 'pcb-panel'],
  ['bg-surface', 'bg-[var(--color-pcb-solder-mask)]'],
  ['border-surface-tint', 'border-[var(--color-pcb-copper)]'],
  
  // Secondary
  ['text-on-secondary', 'text-[var(--color-pcb-solder-mask)]'],
  ['border-secondary', 'border-[var(--color-pcb-phosphor)]'],
  ['bg-secondary/10', 'bg-[var(--color-pcb-phosphor)] text-[var(--color-pcb-solder-mask)]/10'],
  ['bg-secondary', 'bg-[var(--color-pcb-phosphor)] text-[var(--color-pcb-solder-mask)]'],
  ['text-secondary', 'text-[var(--color-pcb-phosphor)]'],
  ['shadow-secondary', 'shadow-[var(--color-pcb-phosphor)]'],
  ['focus-within:shadow-[0_0_12px_rgba(var(--color-secondary),0.15)]', 'focus-within:shadow-[0_0_12px_var(--color-pcb-phosphor)]'],
  
  // Primary
  ['text-on-primary', 'text-[var(--color-pcb-solder-mask)]'],
  ['bg-primary/90', 'active'],
  ['bg-primary', 'bg-[var(--color-pcb-phosphor)]'],
  ['text-primary', 'text-[var(--color-pcb-phosphor)]'],
  
  // Outline
  ['border-outline-variant', 'border-[var(--color-pcb-copper)]'],
  ['border-outline', 'border-[var(--color-pcb-copper)]'],
  
  // Error
  ['bg-error-container', 'bg-red-900/50'],
  ['border-error', 'border-red-500'],
  ['text-error', 'text-red-500'],
  
  // Clean up previous messy replace in button
  ['bg-[var(--color-pcb-phosphor)] text-[var(--color-pcb-solder-mask)]/10 border border-[var(--color-pcb-phosphor)] text-[var(--color-pcb-phosphor)] font-label-caps text-[10px] md:text-label-caps px-sm md:px-md py-xs md:py-sm rounded hover:bg-[var(--color-pcb-phosphor)] text-[var(--color-pcb-solder-mask)] hover:text-[var(--color-pcb-solder-mask)] transition-colors uppercase shadow-[0_0_10px_rgba(102,252,241,0.2)]', 'pcb-pad font-label-caps text-[10px] md:text-[12px] px-sm md:px-md py-xs md:py-sm rounded uppercase'],
  ['bg-red-900/50/20', 'bg-red-900/50'],
  ['bg-[var(--color-pcb-phosphor)] text-[var(--color-pcb-solder-mask)] border border-[var(--color-pcb-phosphor)] text-[var(--color-pcb-phosphor)]', 'pcb-pad'],
  
  // Clean up "Calcular" specific long classes that were missed
  ['bg-secondary/10 border border-secondary text-secondary font-label-caps text-[10px] md:text-label-caps px-sm md:px-md py-xs md:py-sm rounded hover:bg-secondary hover:text-on-secondary transition-colors uppercase shadow-[0_0_10px_rgba(102,252,241,0.2)]', 'pcb-pad font-label-caps text-[10px] md:text-[12px] px-sm md:px-md py-xs md:py-sm rounded uppercase']
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [find, replace] of replacements) {
    content = content.split(find).join(replace);
  }
  
  fs.writeFileSync(filePath, content);
}

console.log('Second pass replace complete!');
