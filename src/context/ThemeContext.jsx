import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Tema da interface: 'light' ou 'dark'.
 * - 1ª visita (nada salvo): usa o tema do sistema operacional, detectado pelo navegador
 *   via prefers-color-scheme. Se o sistema não informar, fica no escuro (tema principal).
 * - Quando o usuário troca pelo botão do header, a escolha é salva e passa a valer sempre.
 * O script em index.html aplica o tema antes da primeira pintura; aqui ele é mantido em sincronia.
 */
const STORAGE_KEY = 'edihub:tema';
const THEME_COLOR = { dark: '#020617', light: '#c8dbf8' };
const lightQuery = () => window.matchMedia('(prefers-color-scheme: light)');

function readSaved() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function apply(theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  // transição suave só na troca (não no carregamento)
  root.classList.add('theme-transition');
  window.setTimeout(() => root.classList.remove('theme-transition'), 250);
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [saved, setSaved] = useState(readSaved);
  const [systemLight, setSystemLight] = useState(() => lightQuery().matches);

  // Enquanto o usuário não escolheu, acompanha o sistema (ex.: Windows troca de tema com o site aberto)
  useEffect(() => {
    if (saved) return undefined;
    const mq = lightQuery();
    const onChange = (e) => setSystemLight(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [saved]);

  const theme = saved ?? (systemLight ? 'light' : 'dark');

  useEffect(() => apply(theme), [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setSaved(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage indisponível: vale só nesta sessão */
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme precisa estar dentro de <ThemeProvider>');
  return ctx;
}
