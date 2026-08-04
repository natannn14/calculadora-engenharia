import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = true, options, className = '', ...props }, ref) => {
    let containerClass = "flex flex-col gap-[var(--spacing-xs)] ";
    if (fullWidth) containerClass += "w-full";

    return (
      <div className={containerClass}>
        {label && (
          <label className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-secondary)] uppercase tracking-wider opacity-80">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`bg-[var(--color-bg)] border ${error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-strong)]'} rounded-[var(--radius-md)] text-[var(--color-text-primary)] px-4 min-h-[48px] font-mono-data text-[var(--font-size-body)] outline-none transition-all duration-var(--transition-fast) shadow-inner focus:border-[var(--color-primary)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),_0_0_0_1px_var(--color-primary)] focus:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-[var(--color-danger)] text-[var(--font-size-caption)]">{error}</span>}
      </div>
    );
  }
);