import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn.js';

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-strong',
  action: 'bg-action text-white hover:bg-action-strong shadow-lg shadow-action/20',
  school: 'bg-school text-white hover:bg-violet-500',
  outline: 'border border-line-strong text-ink hover:border-hover-line hover:bg-hover',
  ghost: 'text-ink-soft hover:bg-hover hover:text-ink',
  subtle: 'bg-raised text-ink hover:bg-line-strong',
  danger: 'text-danger hover:bg-danger/10',
};

const SIZES = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-sm',
  md: 'h-10 gap-2 rounded-lg px-4 text-sm',
  lg: 'h-12 gap-2 rounded-xl px-6 text-base',
  icon: 'size-9 rounded-lg',
};

/**
 * Botão base. Com `to` vira <Link>; com `href` vira <a>.
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, to, href, children, type = 'button', ...props },
  ref,
) {
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} type={type} className={classes} {...props}>
      {children}
    </button>
  );
});
