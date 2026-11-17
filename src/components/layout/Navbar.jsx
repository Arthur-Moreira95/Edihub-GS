import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BellRing, CircleCheck, Menu, Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { cn } from '../../lib/cn.js';
import { Logo } from '../ui/Logo.jsx';
import { Button } from '../ui/Button.jsx';
import { NotificationsMenu } from './NotificationsMenu.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { NAV_LINKS } from './navigation.js';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function Navbar() {
  const { followed, openAlerts, prefs, setPaletteOpen } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const linkClass = ({ isActive }) =>
    cn(
      'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
      // ativo: fundo de hover cheio; hover: versão suave (fica claro qual é a página atual)
      isActive ? 'bg-hover text-ink' : 'text-muted hover:bg-hover-soft hover:text-ink',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/85 backdrop-blur-lg">
      {/* Largura total, estilo YouTube: logo colado na borda esquerda, navegação no centro, ações na borda direita.
          Mobile: flex (logo | ações). Desktop: grid de 3 colunas. */}
      <div className="flex h-16 w-full items-center gap-3 px-4 sm:px-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-6">
        <Link to="/" aria-label="Edihub, página inicial" className="shrink-0 justify-self-start">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-0.5 justify-self-center lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
              {l.to === '/radar' && followed.length > 0 && (
                <span className="tabular rounded-full bg-primary/20 px-1.5 text-[11px] font-bold text-primary-mist">
                  {followed.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 justify-self-end lg:ml-0">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Buscar edital"
            title={`Buscar edital (${isMac ? '⌘' : 'Ctrl'} K)`}
            className="grid size-9 place-items-center rounded-lg text-ink-soft hover:bg-hover hover:text-ink"
          >
            <Search className="size-5" aria-hidden />
          </button>
          <ThemeToggle />
          <NotificationsMenu />
          {/* wrapper com o display responsivo, para não conflitar com o inline-flex do Button */}
          <div className="ml-2 hidden md:block">
            {prefs.ativo ? (
              <Button variant="ghost" to="/radar">
                <CircleCheck className="size-4 text-action-strong" aria-hidden />
                Alertas ativos
              </Button>
            ) : (
              <Button variant="action" onClick={() => openAlerts()}>
                <BellRing className="size-4" aria-hidden />
                Ativar alertas
              </Button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="grid size-9 place-items-center rounded-lg text-ink-soft hover:bg-hover lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="menu-mobile" aria-label="Principal" className="border-t border-line bg-surface px-4 py-3 lg:hidden">
          <ul className="grid gap-1 sm:grid-cols-2">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end} className={linkClass}>
                    <Icon className="size-4" aria-hidden />
                    {l.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
          {!prefs.ativo && (
            <Button
              variant="action"
              className="mt-3 w-full md:hidden"
              onClick={() => {
                setMenuOpen(false);
                openAlerts();
              }}
            >
              <BellRing className="size-4" aria-hidden />
              Ativar alertas grátis
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
