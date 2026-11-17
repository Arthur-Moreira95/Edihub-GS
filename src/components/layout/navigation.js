import { CalendarDays, FileSearch, House, Radar, School, Sparkles } from 'lucide-react';

export const NAV_LINKS = [
  { to: '/', label: 'Início', icon: House, end: true },
  { to: '/editais', label: 'Editais', icon: FileSearch },
  { to: '/calendario', label: 'Calendário', icon: CalendarDays },
  { to: '/radar', label: 'Meu radar', icon: Radar },
  { to: '/planos', label: 'Planos', icon: Sparkles },
  { to: '/escolas', label: 'Para escolas', icon: School },
];
