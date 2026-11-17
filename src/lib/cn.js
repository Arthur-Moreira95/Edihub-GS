/** Junta classes condicionais: cn('a', cond && 'b', ['c']) */
export function cn(...args) {
  return args.flat(Infinity).filter(Boolean).join(' ');
}
