import { Bell, BellRing } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { gsap } from '../../lib/gsap.js';
import { cn } from '../../lib/cn.js';

/** Sino de acompanhar. Balança ao ativar (resposta direta à ação do usuário). */
export function FollowButton({ edital, withLabel = false, className }) {
  const { isFollowing, toggleFollow } = useApp();
  const on = isFollowing(edital.id);
  const Icon = on ? BellRing : Bell;

  const handleClick = (event) => {
    event.stopPropagation();
    if (!on) {
      const icon = event.currentTarget.querySelector('svg');
      gsap.fromTo(icon, { rotate: -18 }, { rotate: 0, duration: 0.7, ease: 'elastic.out(1.2, 0.3)' });
    }
    toggleFollow(edital.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={on}
      aria-label={on ? `Deixar de acompanhar ${edital.sigla}` : `Acompanhar ${edital.sigla}`}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors',
        withLabel ? 'h-10 px-4' : 'size-9',
        on
          ? 'border-primary/60 bg-primary/15 text-primary-mist hover:bg-primary/25'
          : 'border-line-strong text-ink-soft hover:border-hover-line hover:bg-hover-soft hover:text-ink',
        className,
      )}
    >
      <Icon className="size-4 origin-top" aria-hidden />
      {withLabel && (on ? 'Acompanhando' : 'Acompanhar')}
    </button>
  );
}
