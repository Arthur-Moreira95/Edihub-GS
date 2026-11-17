import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { getEditalById } from '../../data/editais.js';
import { useEditalParam } from '../../hooks/useEditalParam.js';
import { useHotkey } from '../../hooks/useHotkey.js';
import { ScrollTrigger } from '../../lib/gsap.js';
import { EditalDrawer } from '../editais/EditalDrawer.jsx';
import { AlertsModal } from '../alerts/AlertsModal.jsx';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { CommandPalette } from './CommandPalette.jsx';

export function AppLayout() {
  const { pathname } = useLocation();
  const { alertsModal, paletteOpen, setPaletteOpen } = useApp();
  const { editalId, closeEdital } = useEditalParam();
  const edital = editalId ? getEditalById(editalId) : null;

  useHotkey('mod+k', () => setPaletteOpen(true));

  // Nova página: volta ao topo e recalcula os ScrollTriggers
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {edital && <EditalDrawer key={edital.id} edital={edital} onClose={closeEdital} />}
      {alertsModal.open && <AlertsModal key={alertsModal.editalId ?? 'geral'} />}
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}
