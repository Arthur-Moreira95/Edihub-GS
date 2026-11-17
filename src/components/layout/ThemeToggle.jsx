import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

/** Botão do header que alterna entre tema claro e escuro. Mostra o ícone do tema para o qual vai mudar. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const toLight = theme === 'dark';
  const label = toLight ? 'Ativar tema claro' : 'Ativar tema escuro';
  const Icon = toLight ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-lg text-ink-soft hover:bg-hover hover:text-ink"
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
