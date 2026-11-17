import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useEditalParam } from '../../hooks/useEditalParam.js';
import { getNextDeadline } from '../../lib/edital.js';
import { cn } from '../../lib/cn.js';
import { Modal } from '../ui/Overlay.jsx';
import { InstitutionMark } from '../ui/InstitutionMark.jsx';
import { DaysLeft } from '../ui/DaysLeft.jsx';
import { NAV_LINKS } from './navigation.js';

const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/** Busca global (Ctrl/⌘ + K): editais e páginas. */
export function CommandPalette({ onClose }) {
  const { editais } = useApp();
  const { openEdital } = useEditalParam();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    // Relevância: sigla exata > sigla começa com > nome > demais campos
    const score = (e) => {
      if (!q) return 1;
      const sigla = normalize(e.sigla);
      if (sigla === q) return 4;
      if (sigla.startsWith(q)) return 3;
      if (normalize(e.nome).includes(q)) return 2;
      return normalize(`${e.instituicao} ${e.cidade} ${e.areas.join(' ')}`).includes(q) ? 1 : 0;
    };
    const ranked = editais
      .map((e) => ({ e, s: score(e) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 7);
    const toItem = ({ e }) => ({ type: 'edital', id: e.id, edital: e });
    const pages = NAV_LINKS.filter((l) => q && normalize(l.label).startsWith(q)).map((l) => ({
      type: 'page',
      id: l.to,
      link: l,
    }));
    // Sigla exata ou prefixo vem antes dos atalhos de página
    return [...ranked.filter((r) => r.s >= 3).map(toItem), ...pages, ...ranked.filter((r) => r.s < 3).map(toItem)];
  }, [editais, query]);

  const select = (item, close) => {
    close();
    if (item.type === 'page') navigate(item.link.to);
    else openEdital(item.id);
  };

  return (
    <Modal onClose={onClose} label="Buscar edital" initialFocus={inputRef} className="sm:max-w-xl">
      {({ close }) => (
        <div
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Enter' && results[active]) {
              e.preventDefault();
              select(results[active], close);
            }
          }}
        >
          <div className="flex items-center gap-3 border-b border-line px-5 py-4 pr-14">
            <Search className="size-5 shrink-0 text-muted" aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="UERJ, ITA, medicina, São Paulo…"
              aria-label="Buscar edital ou página"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-results"
              aria-activedescendant={results[active] ? `opt-${results[active].id}` : undefined}
              className="w-full bg-transparent text-base text-ink placeholder:text-faint focus:outline-none"
            />
          </div>
          <ul id="palette-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted">
                Nenhum edital com “{query}”. Tente a sigla da instituição, como UERJ ou EsPCEx.
              </li>
            )}
            {results.map((item, i) => {
              const isActive = i === active;
              const common = {
                id: `opt-${item.id}`,
                role: 'option',
                'aria-selected': isActive,
                onMouseEnter: () => setActive(i),
                onClick: () => select(item, close),
                className: cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5',
                  isActive ? 'bg-raised' : 'hover:bg-hover-soft',
                ),
              };
              if (item.type === 'page') {
                const Icon = item.link.icon;
                return (
                  <li key={item.id} {...common}>
                    <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary-soft">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="flex-1 text-sm text-ink">Ir para {item.link.label}</span>
                    {isActive && <CornerDownLeft className="size-4 text-faint" aria-hidden />}
                  </li>
                );
              }
              const next = getNextDeadline(item.edital);
              return (
                <li key={item.id} {...common}>
                  <InstitutionMark edital={item.edital} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{item.edital.nome}</span>
                    <span className="block truncate text-xs text-muted">{item.edital.instituicao}</span>
                  </span>
                  {next && <DaysLeft dias={next.dias} />}
                </li>
              );
            })}
          </ul>
          <p className="border-t border-line px-5 py-2.5 text-xs text-faint">
            Use ↑ ↓ para navegar, Enter para abrir e Esc para fechar.
          </p>
        </div>
      )}
    </Modal>
  );
}
