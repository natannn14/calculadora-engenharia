import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', fullWidth, className = '', children, disabled, ...props }: ButtonProps) {
  let baseClass = "flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-[var(--radius-md)] font-label-caps font-bold text-sm tracking-wider uppercase transition-all duration-var(--transition-fast) relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed ";
  
  if (fullWidth) baseClass += "w-full ";

  let variantClass = "";
  switch (variant) {
    case 'primary':
      variantClass = "bg-[var(--color-primary-dark)] text-[var(--color-text-primary)] border border-[var(--color-primary)] shadow-sm hover:bg-[var(--color-primary)] hover:shadow-var(--glow-primary) hover:-translate-y-px active:translate-y-px focus:ring-[var(--color-primary)]";
      break;
    case 'secondary':
      variantClass = "bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-secondary)] focus:ring-[var(--color-text-secondary)]";
      break;
    case 'ghost':
      variantClass = "bg-transparent text-[var(--color-text-secondary)] border border-transparent hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)] focus:ring-[var(--color-surface-elevated)]";
      break;
    case 'danger':
      variantClass = "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/50 hover:bg-[var(--color-danger)] hover:text-white focus:ring-[var(--color-danger)]";
      break;
  }

  return (
    <button className={baseClass + variantClass + " " + className} disabled={disabled} {...props}>
      {children}
    </button>
  );
}