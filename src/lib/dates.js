const DAY = 86_400_000;

/** Hoje à meia-noite (horário local). */
export function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Data a `n` dias de hoje. Os mocks usam deslocamentos para o demo nunca "envelhecer". */
export function fromToday(n) {
  const d = today();
  d.setDate(d.getDate() + n);
  return d;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / DAY);
}

export function daysUntil(date) {
  return daysBetween(today(), date);
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function dayKey(date) {
  const d = startOfDay(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const fmtShort = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
const fmtLong = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' });
const fmtFull = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtMonth = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

export const formatShort = (d) => fmtShort.format(d);
export const formatLong = (d) => fmtLong.format(d);
export const formatFull = (d) => fmtFull.format(d);
export const formatWeekday = (d) => fmtWeekday.format(d).replace('.', '');
export const formatMonth = (d) => {
  const s = fmtMonth.format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** "hoje", "amanhã", "em 5 dias", "há 3 dias" */
export function relativeDays(date) {
  const n = daysUntil(date);
  if (n === 0) return 'hoje';
  if (n === 1) return 'amanhã';
  if (n === -1) return 'ontem';
  if (n > 1) return `em ${n} dias`;
  return `há ${Math.abs(n)} dias`;
}

export function formatRange(inicio, fim) {
  if (isSameDay(inicio, fim)) return formatLong(inicio);
  return `${formatShort(inicio)} a ${formatShort(fim)}`;
}
