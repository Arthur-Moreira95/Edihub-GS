import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useEditalParam } from '../hooks/useEditalParam.js';
import { AREAS, CATEGORIAS, ORDENACAO, UFS } from '../data/constants.js';
import { applyFilters, countOptions, sortEditais } from '../lib/filters.js';
import { FiltersPanel, STATUS_FILTROS } from '../components/editais/FiltersPanel.jsx';
import { EditalCard } from '../components/editais/EditalCard.jsx';
import { EditalRow } from '../components/editais/EditalRow.jsx';
import { AdBanner } from '../components/layout/AdBanner.jsx';
import { SegmentedControl } from '../components/ui/SegmentedControl.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Button } from '../components/ui/Button.jsx';
import { inputClasses } from '../components/ui/Field.jsx';
import { cn } from '../lib/cn.js';

const FILTER_KEYS = ['q', 'categoria', 'status', 'uf', 'area', 'seguindo'];

export default function EditaisPage() {
  const { editais, followed } = useApp();
  const { openEdital } = useEditalParam();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Estado dos filtros vive na URL: dá para compartilhar uma busca
  const filters = {
    q: params.get('q') ?? '',
    categoria: params.get('categoria') ?? '',
    status: params.get('status') ?? '',
    uf: params.get('uf') ?? '',
    area: params.get('area') ?? '',
    seguindo: params.get('seguindo') === '1',
  };
  const ordem = params.get('ordem') ?? 'prazo';
  const vista = params.get('vista') ?? 'grade';

  const setParam = (key, value) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  const clearFilters = () =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        FILTER_KEYS.forEach((k) => next.delete(k));
        return next;
      },
      { replace: true },
    );

  const ctx = { followed };
  const filterKey = FILTER_KEYS.map((k) => filters[k]).join('|');

  const results = useMemo(
    () => sortEditais(applyFilters(editais, filters, ctx), ordem),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editais, filterKey, ordem, followed],
  );

  const counts = useMemo(
    () => ({
      categoria: countOptions(editais, filters, ctx, 'categoria', Object.keys(CATEGORIAS)),
      status: countOptions(editais, filters, ctx, 'status', Object.keys(STATUS_FILTROS)),
      uf: countOptions(editais, filters, ctx, 'uf', Object.keys(UFS)),
      area: countOptions(editais, filters, ctx, 'area', AREAS),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editais, filterKey, followed],
  );

  const activeFilters = [
    filters.categoria && { key: 'categoria', label: CATEGORIAS[filters.categoria]?.label },
    filters.status && { key: 'status', label: STATUS_FILTROS[filters.status] },
    filters.uf && { key: 'uf', label: UFS[filters.uf] },
    filters.area && { key: 'area', label: filters.area },
    filters.seguindo && { key: 'seguindo', label: 'Que acompanho' },
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">Editais</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Vestibulares estaduais, federais, particulares e concursos militares, com a situação de cada um hoje.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside
          id="filtros"
          className={cn('lg:sticky lg:top-24 lg:block lg:self-start', showFilters ? 'block' : 'hidden')}
          aria-label="Filtros"
        >
          <FiltersPanel filters={filters} setFilter={setParam} counts={counts} followedCount={followed.length} />
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <label className="relative min-w-0 flex-1 basis-60">
              <span className="sr-only">Buscar por nome, sigla ou cidade</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint"
                aria-hidden
              />
              <input
                type="search"
                value={filters.q}
                onChange={(e) => setParam('q', e.target.value)}
                placeholder="Nome, sigla ou cidade"
                className={cn(inputClasses, 'pl-9')}
              />
            </label>
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              aria-controls="filtros"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtros{activeFilters.length ? ` (${activeFilters.length})` : ''}
            </Button>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="sr-only sm:not-sr-only">Ordenar</span>
              <select
                value={ordem}
                onChange={(e) => setParam('ordem', e.target.value === 'prazo' ? '' : e.target.value)}
                className={cn(inputClasses, 'w-auto py-2')}
              >
                {Object.entries(ORDENACAO).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <SegmentedControl
              label="Visualização"
              value={vista}
              onChange={(v) => setParam('vista', v === 'grade' ? '' : v)}
              options={[
                { value: 'grade', icon: LayoutGrid, ariaLabel: 'Grade' },
                { value: 'lista', icon: List, ariaLabel: 'Lista' },
              ]}
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
            <p className="text-muted" aria-live="polite">
              {results.length} {results.length === 1 ? 'edital' : 'editais'}
            </p>
            {activeFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setParam(f.key, '')}
                className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary-mist hover:bg-primary/25"
                aria-label={`Remover filtro ${f.label}`}
              >
                {f.label}
                <X className="size-3" aria-hidden />
              </button>
            ))}
            {activeFilters.length > 1 && (
              <button type="button" onClick={clearFilters} className="text-xs font-semibold text-muted hover:text-ink">
                Limpar tudo
              </button>
            )}
          </div>

          <AdBanner />

          <div className="mt-5">
            {results.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Nenhum edital com esses filtros"
                action={
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                }
              >
                Remova um filtro ou busque pela sigla da instituição, como UERJ ou ITA.
              </EmptyState>
            ) : vista === 'lista' ? (
              <ul className="rounded-2xl border border-line bg-surface">
                {results.map((e) => (
                  <EditalRow key={e.id} edital={e} onOpen={openEdital} />
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((e) => (
                  <EditalCard key={e.id} edital={e} onOpen={openEdital} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
