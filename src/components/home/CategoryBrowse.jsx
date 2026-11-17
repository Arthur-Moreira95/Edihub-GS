import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORIAS } from '../../data/constants.js';
import { getStatus } from '../../lib/edital.js';
import { InstitutionMark } from '../ui/InstitutionMark.jsx';

/** Navegação por tipo de certame, com as instituições de cada grupo. */
export function CategoryBrowse() {
  const { editais } = useApp();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="categorias-titulo">
      <h2 id="categorias-titulo" className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
        Procure pelo tipo de prova
      </h2>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {Object.entries(CATEGORIAS).map(([key, cat]) => {
          const grupo = editais.filter((e) => e.categoria === key);
          const abertos = grupo.filter((e) => ['aberta', 'isencao'].includes(getStatus(e))).length;
          return (
            <li key={key}>
              <Link
                to={`/editais?categoria=${key}`}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[14rem_1fr_auto] sm:gap-8"
              >
                <div>
                  <p className="text-xl font-semibold text-ink group-hover:text-primary-mist">{cat.label}</p>
                  <p className="text-sm text-muted">
                    {grupo.length} editais, {abertos} com inscrição ou isenção aberta
                  </p>
                </div>
                <div className="row-start-2 flex flex-wrap gap-1.5 sm:row-start-auto">
                  {grupo.map((e) => (
                    <InstitutionMark key={e.id} edital={e} size="sm" className="ring-2 ring-base" />
                  ))}
                </div>
                <ChevronRight
                  className="col-start-2 row-span-2 row-start-1 size-5 text-faint transition-transform group-hover:translate-x-1 group-hover:text-ink sm:col-start-auto sm:row-span-1 sm:row-start-auto"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
