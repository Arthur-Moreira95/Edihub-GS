import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo.jsx';
import { CATEGORIAS } from '../../data/constants.js';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="col-span-2 max-w-sm md:col-span-1">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Editais de vestibulares públicos, privados e militares num só lugar, com os prazos que importam e aviso
            quando algo muda.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink">Editais</h2>
          <ul className="text-sm md:space-y-2">
            {Object.entries(CATEGORIAS).map(([key, c]) => (
              <li key={key}>
                <Link to={`/editais?categoria=${key}`} className="block py-2 text-muted hover:text-ink md:inline md:py-0">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink">Edihub</h2>
          <ul className="text-sm md:space-y-2">
            <li>
              <Link to="/calendario" className="block py-2 text-muted hover:text-ink md:inline md:py-0">
                Calendário de prazos
              </Link>
            </li>
            <li>
              <Link to="/planos" className="block py-2 text-muted hover:text-ink md:inline md:py-0">
                Planos e preços
              </Link>
            </li>
            <li>
              <Link to="/escolas" className="block py-2 text-muted hover:text-ink md:inline md:py-0">
                Para escolas e cursinhos
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-faint sm:px-6 lg:px-8">
          Projeto acadêmico com dados de demonstração. Confira sempre o edital oficial publicado pela organizadora.
        </p>
      </div>
    </footer>
  );
}
