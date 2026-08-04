import React from 'react';

export function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'primary' | 'success' | 'danger', className?: string }) {
  let vClass = "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]";
  if (variant === 'primary') vClass = "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30";
  if (variant === 'success') vClass = "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30";
  if (variant === 'danger') vClass = "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30";
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] border font-mono-code text-[10px] uppercase tracking-widest ${vClass} ${className}`}>
      {children}
    </span>
  );
}