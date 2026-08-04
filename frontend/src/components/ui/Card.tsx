import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-var(--shadow-md) relative overflow-hidden transition-all duration-var(--transition-normal) hover:border-[var(--color-border-strong)] hover:shadow-var(--shadow-lg) ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent opacity-50" />
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-[var(--spacing-lg)] border-b border-[var(--color-border)]/30 flex items-center justify-between gap-[var(--spacing-md)] ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-[var(--spacing-lg)] relative ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-[var(--spacing-lg)] border-t border-[var(--color-border)]/30 flex items-center gap-[var(--spacing-md)] ${className}`}>
      {children}
    </div>
  );
}