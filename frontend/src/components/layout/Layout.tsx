import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  pageTitle?: string;
}

export function Layout({ children, headerRight, pageTitle = "CalculaEng" }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent font-body-md text-[var(--font-size-body)]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen relative z-10 w-full overflow-hidden pb-[64px] lg:pb-0">
        <header className="h-[64px] bg-[var(--color-surface)]/90 backdrop-blur-md z-40 px-[var(--spacing-lg)] flex items-center justify-between border-b border-[var(--color-border)] flex-shrink-0">
          <div>
            <h2 className="font-display font-semibold text-[var(--font-size-h3)] text-[var(--color-text-primary)] leading-none uppercase tracking-wide">
              {pageTitle}
            </h2>
            <span className="hidden sm:inline-block text-[var(--font-size-caption)] text-[var(--color-text-secondary)] font-mono-code uppercase mt-1">
              Engineering Toolkit · v0.1
            </span>
          </div>
          <div className="flex items-center gap-[var(--spacing-md)]">
            {headerRight}
          </div>
        </header>

        <main className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar p-[var(--spacing-md)] lg:p-[var(--spacing-xl)]">
          <div className="w-full max-w-7xl mx-auto flex-1 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}