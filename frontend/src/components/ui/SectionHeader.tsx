export function SectionHeader({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="flex items-baseline justify-between w-full border-b border-[var(--color-border-strong)] pb-[var(--spacing-md)] mb-[var(--spacing-lg)] relative flex-wrap gap-[var(--spacing-sm)]">
      <div className="absolute -bottom-[1px] left-0 w-1/3 max-w-[200px] h-[2px] bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]"></div>
      <div>
        <h1 className="font-display text-[var(--font-size-display)] text-[var(--color-text-primary)] tracking-tight uppercase leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono-code text-[var(--font-size-caption)] text-[var(--color-primary)] opacity-80 mt-[var(--spacing-xs)] uppercase tracking-widest">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}