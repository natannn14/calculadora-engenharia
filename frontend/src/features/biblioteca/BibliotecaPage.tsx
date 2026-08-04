import { useState, useEffect } from 'react';
import { knowledgeRepo } from '../../repository';
import type { KnowledgeFormula } from '../../core/types/knowledge';

export function BibliotecaPage() {
  const [formulas, setFormulas] = useState<KnowledgeFormula[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const all = await knowledgeRepo.searchFormulas('');
      setFormulas(all);
    }
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(formulas.map(f => f.category)))];

  const filtered = formulas.filter(f => {
    const matchesSearch = search === '' ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.equationLaTeX.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-2">
      {/* Header */}
      <div>
        <h1 className="font-display text-[clamp(24px,4vw,36px)] text-[var(--color-text-primary)] leading-none tracking-tight">
          Biblioteca de <span className="text-[var(--color-primary)]">Fórmulas</span>
        </h1>
        <p className="font-body-md text-[var(--color-text-secondary)] mt-1">
          {formulas.length} fórmulas · Hipóteses, variáveis, erros comuns e referências
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--color-text-muted)]">search</span>
          <input
            type="text"
            placeholder="Buscar por nome, descrição ou equação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-body-md text-[var(--font-size-body)] outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-body-md text-[var(--font-size-small)] outline-none focus:border-[var(--color-primary)] cursor-pointer"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'Todas as categorias' : c}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <span className="font-mono-code text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Formula Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((formula) => {
          const isExpanded = expandedId === formula.id;
          return (
            <div
              key={formula.id}
              className={`rounded-xl border transition-all duration-300 ${
                isExpanded
                  ? 'bg-[var(--color-surface-elevated)] border-[var(--color-primary)]/40 shadow-lg'
                  : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
              }`}
            >
              {/* Summary (always visible) */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : formula.id)}
                className="w-full flex items-start gap-4 p-4 text-left"
              >
                <span className="material-symbols-outlined text-[20px] text-[var(--color-primary)] mt-0.5 flex-shrink-0">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-[var(--color-text-primary)]">{formula.name}</h3>
                    <span className="text-[9px] font-mono-code uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                      {formula.category}
                    </span>
                    {formula.normativeRef && (
                      <span className="text-[9px] font-mono-code uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full border border-[var(--color-primary)]/20">
                        {formula.normativeRef.standard} {formula.normativeRef.version}
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--font-size-small)] text-[var(--color-text-muted)]">{formula.description}</p>
                  <div className="mt-2 font-mono-code text-[var(--color-primary)] text-[var(--font-size-body)] break-all">
                    {formula.equationLaTeX}
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-0 ml-9 flex flex-col gap-4 border-t border-[var(--color-border)] mt-0 pt-4">
                  {/* Variables */}
                  <div>
                    <h4 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-primary)] uppercase tracking-widest mb-2">Variáveis</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formula.variables.map((v, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--color-surface)]/50 border border-[var(--color-border)]">
                          <span className="font-mono-code text-[var(--color-primary)] font-bold min-w-[24px]">{v.symbol}</span>
                          <div className="flex-1">
                            <span className="text-[var(--font-size-small)] text-[var(--color-text-primary)] font-medium block">{v.name}</span>
                            <span className="text-[var(--font-size-caption)] text-[var(--color-text-muted)] block">{v.description}</span>
                            <span className="text-[var(--font-size-caption)] text-[var(--color-text-secondary)] font-mono-code">[{v.unit}]</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hypotheses */}
                  {formula.hypotheses.length > 0 && (
                    <div>
                      <h4 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Hipóteses</h4>
                      <ul className="flex flex-col gap-1">
                        {formula.hypotheses.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-[var(--font-size-small)] text-[var(--color-text-secondary)]">
                            <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)] mt-0.5">info</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Limitations */}
                  {formula.limitations.length > 0 && (
                    <div>
                      <h4 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Limitações</h4>
                      <ul className="flex flex-col gap-1">
                        {formula.limitations.map((l, i) => (
                          <li key={i} className="flex items-start gap-2 text-[var(--font-size-small)] text-[var(--color-text-secondary)]">
                            <span className="material-symbols-outlined text-[14px] text-yellow-500 mt-0.5">warning</span>
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Errors */}
                  {formula.commonErrors.length > 0 && (
                    <div>
                      <h4 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Erros Comuns</h4>
                      <ul className="flex flex-col gap-1">
                        {formula.commonErrors.map((e, i) => (
                          <li key={i} className="flex items-start gap-2 text-[var(--font-size-small)] text-[var(--color-text-secondary)]">
                            <span className="material-symbols-outlined text-[14px] text-red-400 mt-0.5">error</span>
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Applications */}
                  {formula.applications.length > 0 && (
                    <div>
                      <h4 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Aplicações</h4>
                      <div className="flex flex-wrap gap-2">
                        {formula.applications.map((a, i) => (
                          <span key={i} className="text-[var(--font-size-caption)] font-mono-code text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* References */}
                  {formula.references.length > 0 && (
                    <div>
                      <h4 className="font-label-caps text-[var(--font-size-caption)] text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Referências</h4>
                      <ul className="flex flex-col gap-1">
                        {formula.references.map((r, i) => (
                          <li key={i} className="text-[var(--font-size-small)] text-[var(--color-text-secondary)] italic">
                            {r.author && `${r.author}. `}{r.title}{r.year && ` (${r.year})`}{r.standard && ` — ${r.standard}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <span className="material-symbols-outlined text-[48px] block mb-3 opacity-30">search_off</span>
            <p className="font-body-md">Nenhuma fórmula encontrada para "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
