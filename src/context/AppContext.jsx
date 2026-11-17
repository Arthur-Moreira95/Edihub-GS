import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { EDITAIS, getEditalById } from '../data/editais.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { getNextDeadline, getRetificacoes } from '../lib/edital.js';
import { daysUntil, dayKey } from '../lib/dates.js';
import { useToast } from './ToastContext.jsx';

const AppContext = createContext(null);

const DEFAULT_PREFS = {
  ativo: false,
  nome: '',
  whatsapp: '',
  email: '',
  areas: [],
  canais: { whatsapp: true, email: true },
  antecedencia: 3,
};

export function AppProvider({ children }) {
  const { notify } = useToast();
  const [followed, setFollowed] = useLocalStorage('edihub:seguindo', ['uerj-2027', 'espcex-2027']);
  const [prefs, setPrefs] = useLocalStorage('edihub:alertas', DEFAULT_PREFS);
  const [plan, setPlan] = useLocalStorage('edihub:plano', 'free');
  const [readIds, setReadIds] = useLocalStorage('edihub:lidas', []);
  const [alertsModal, setAlertsModal] = useState({ open: false, editalId: null });
  const [paletteOpen, setPaletteOpen] = useState(false);

  const isFollowing = useCallback((id) => followed.includes(id), [followed]);

  const toggleFollow = useCallback(
    (id) => {
      const edital = getEditalById(id);
      const following = followed.includes(id);
      setFollowed((list) => (following ? list.filter((x) => x !== id) : [...list, id]));
      notify(
        following
          ? `Você deixou de acompanhar ${edital.sigla}.`
          : `${edital.sigla} entrou no seu radar. Avisaremos sobre prazos e retificações.`,
        {
          tone: following ? 'info' : 'success',
          action: {
            label: 'Desfazer',
            onClick: () => setFollowed((list) => (following ? [...list, id] : list.filter((x) => x !== id))),
          },
        },
      );
    },
    [followed, notify, setFollowed],
  );

  const openAlerts = useCallback((editalId = null) => setAlertsModal({ open: true, editalId }), []);
  const closeAlerts = useCallback(() => setAlertsModal((s) => ({ ...s, open: false })), []);

  const saveAlerts = useCallback(
    (next, editalId) => {
      setPrefs({ ...next, ativo: true });
      if (editalId && !followed.includes(editalId)) setFollowed((list) => [...list, editalId]);
    },
    [followed, setFollowed, setPrefs],
  );

  const disableAlerts = useCallback(() => {
    setPrefs((p) => ({ ...p, ativo: false }));
    notify('Alertas pausados. Você ainda pode consultar tudo no site.', { tone: 'info' });
  }, [notify, setPrefs]);

  // Notificações derivadas dos editais acompanhados
  const notifications = useMemo(() => {
    const items = [];
    for (const id of followed) {
      const ed = getEditalById(id);
      if (!ed) continue;
      for (const r of getRetificacoes(ed)) {
        if (daysUntil(r.data) < -30) continue;
        items.push({
          id: r.id,
          tipo: 'retificacao',
          edital: ed,
          data: r.data,
          titulo: `Retificação em ${ed.sigla}`,
          texto: `${r.campo}: agora "${r.depois}".`,
        });
      }
      const next = getNextDeadline(ed);
      if (next && next.dias <= 7) {
        items.push({
          id: `${ed.id}-prazo-${dayKey(next.data)}`,
          tipo: 'prazo',
          edital: ed,
          data: next.data,
          titulo: next.dias === 0 ? `${ed.sigla}: é hoje` : `${ed.sigla}: faltam ${next.dias} dias`,
          texto: next.label,
        });
      }
    }
    return items
      .map((n) => ({ ...n, lida: readIds.includes(n.id) }))
      .sort((a, b) => Number(a.lida) - Number(b.lida) || Math.abs(daysUntil(a.data)) - Math.abs(daysUntil(b.data)));
  }, [followed, readIds]);

  const unreadCount = notifications.filter((n) => !n.lida).length;

  const markRead = useCallback((id) => setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id])), [setReadIds]);
  const markAllRead = useCallback(
    () => setReadIds((ids) => [...new Set([...ids, ...notifications.map((n) => n.id)])]),
    [notifications, setReadIds],
  );

  const value = useMemo(
    () => ({
      editais: EDITAIS,
      followed,
      isFollowing,
      toggleFollow,
      prefs,
      setPrefs,
      saveAlerts,
      disableAlerts,
      plan,
      setPlan,
      alertsModal,
      openAlerts,
      closeAlerts,
      paletteOpen,
      setPaletteOpen,
      notifications,
      unreadCount,
      markRead,
      markAllRead,
    }),
    [
      followed,
      isFollowing,
      toggleFollow,
      prefs,
      setPrefs,
      saveAlerts,
      disableAlerts,
      plan,
      setPlan,
      alertsModal,
      openAlerts,
      closeAlerts,
      paletteOpen,
      notifications,
      unreadCount,
      markRead,
      markAllRead,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>');
  return ctx;
}
